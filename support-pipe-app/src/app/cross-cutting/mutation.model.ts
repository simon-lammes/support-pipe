export interface Mutation<T> {
  timestampIso: string;
  type: 'create' | 'edit' | 'delete';
  originalState: T;
  modifiedState: T;
}
