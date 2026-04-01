import { IdempotencyConflictError } from '../errors/domain.errors';
import type { IdempotencyStore } from '../interfaces/repositories.interface';

export class IdempotencyService {
  constructor(private readonly store: IdempotencyStore) {}

  async withLock<T>(scopedKey: string, callback: () => Promise<T>): Promise<T> {
    const locked = await this.store.tryLock(scopedKey, 60);
    if (!locked) {
      throw new IdempotencyConflictError();
    }

    try {
      return await callback();
    } finally {
      await this.store.release(scopedKey);
    }
  }
}
