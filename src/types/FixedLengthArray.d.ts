export type FixedLengthArray<
  T,
  N extends number,
  R extends T[] = [],
> = R['length'] extends N ? R : FixedLengthArray<T, N, [T, ...R]>;
