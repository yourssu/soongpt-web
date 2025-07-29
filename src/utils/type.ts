export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Merge<T, U> = Prettify<Omit<T, keyof U> & U>;
