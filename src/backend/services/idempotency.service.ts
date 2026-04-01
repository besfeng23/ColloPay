import { createHash } from 'crypto';
import { DomainError } from '../domain/errors';
import type { IdempotencyRecord } from '../domain/types';
import type { IdempotencyRepository } from '../ports/repositories';

export class IdempotencyService {
  private readonly inFlightByScopeKey = new Map<string, Promise<unknown>>();

  constructor(private readonly idempotencyRepo: IdempotencyRepository) {}

  async enforce<T extends object>(scope: string, key: string, request: object, handler: () => Promise<T>): Promise<T> {
    const result = await this.enforceWithMetadata(scope, key, request, handler);
    return result.response;
  }

  async enforceWithMetadata<T extends object>(
    scope: string,
    key: string,
    request: object,
    handler: () => Promise<T>,
  ): Promise<{ response: T; replayed: boolean }> {
    const scopedKey = `${scope}:${key}`;
    const inFlight = this.inFlightByScopeKey.get(scopedKey);
    if (inFlight) {
      await inFlight;
      const replay = await this.idempotencyRepo.getByKey(scope, key);
      if (replay) {
        if (replay.requestHash !== hashPayload(request)) {
          throw new DomainError('Idempotency key replay conflict.', 'CONFLICT_ERROR', { scope, key });
        }

        return { response: JSON.parse(replay.responseSnapshot) as T, replayed: true };
      }
      // TODO(launch-blocker): Replace in-memory contention handling with datastore-level
      // atomic reservation + unique constraint for horizontally scaled replicas.
    }

    const execution = this.executeWithPersistence(scope, key, request, handler);
    this.inFlightByScopeKey.set(scopedKey, execution);
    try {
      return await execution;
    } finally {
      this.inFlightByScopeKey.delete(scopedKey);
    }
  }

  private async executeWithPersistence<T extends object>(
    scope: string,
    key: string,
    request: object,
    handler: () => Promise<T>,
  ): Promise<{ response: T; replayed: boolean }> {
    const requestHash = hashPayload(request);
    const existing = await this.idempotencyRepo.getByKey(scope, key);

    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new DomainError('Idempotency key replay conflict.', 'CONFLICT_ERROR', { scope, key });
      }

      return { response: JSON.parse(existing.responseSnapshot) as T, replayed: true };
    }

    const response = await handler();
    const record: IdempotencyRecord = {
      key,
      scope,
      requestHash,
      responseSnapshot: JSON.stringify(response),
      createdAt: new Date().toISOString(),
    };

    await this.idempotencyRepo.create(record);
    return { response, replayed: false };
  }
}

function hashPayload(payload: object): string {
  const stable = JSON.stringify(sortObject(payload));
  return createHash('sha256').update(stable).digest('hex');
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as object)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObject((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }

  return value;
}
