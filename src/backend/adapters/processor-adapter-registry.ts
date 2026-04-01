import { DomainError } from '../domain/errors';
import type { ProcessorType } from '../domain/types';
import type { ProcessorAdapter, ProcessorAdapterRegistry } from './processor-adapter';

export class InMemoryProcessorAdapterRegistry implements ProcessorAdapterRegistry {
  private readonly adapterMap: Map<ProcessorType, ProcessorAdapter>;

  constructor(adapters: ProcessorAdapter[]) {
    this.adapterMap = new Map(adapters.map((adapter) => [adapter.processor, adapter]));
  }

  getAdapter(processor: ProcessorType): ProcessorAdapter {
    const adapter = this.adapterMap.get(processor);
    if (!adapter) {
      throw new DomainError(`No adapter registered for ${processor}.`, 'INTEGRATION_ERROR');
    }

    return adapter;
  }
}
