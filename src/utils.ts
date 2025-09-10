export type BuildTuple<L extends number, T, R extends unknown[] = []> =
  R['length'] extends L ? R : BuildTuple<L, T, [T, ...R]>;
