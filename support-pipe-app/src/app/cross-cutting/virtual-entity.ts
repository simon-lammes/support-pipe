/**
 * This type is useful for optimistic caching.
 * When we create a new entity, we want to pretend it is already successfully
 * created although the server has not yet responded. This class name contains
 * the term 'virtual' because we pretend this entity is persistent even the persisting
 * is still ongoing.
 */
export interface VirtualEntity<T> {
  uuid: string;
  persisted?: T;
  mutated?: T;
}
