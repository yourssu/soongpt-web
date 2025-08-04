export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Merge<T, U> = Prettify<Omit<T, keyof U> & U>;

const emptyObjectSymbol: unique symbol = Symbol('emptyObjectSymbol');
export type EmptyObjectType = { [emptyObjectSymbol]?: never };

export type ObjectKeys<T extends Record<PropertyKey, unknown>> = `${Exclude<keyof T, symbol>}`;
