interface ValueType {
  value?: any;
}
export type InputValues<K extends keyof any> = Record<K, ValueType>;


