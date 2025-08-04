import { z } from 'zod/v4';

const decoder = {
  num: (v: string): number => Number(decodeURIComponent(v)),
  str: (v: string): string => decodeURIComponent(v),
  bool: (v: string): boolean => decodeURIComponent(v) === 'true',
  numArray: (v: string): number[] =>
    decodeURIComponent(v)
      .split(/ ?,/)
      .map((item) => Number(item)),
  strArray: (v: string): string[] => decodeURIComponent(v).split(/ ?,/).filter(Boolean),
  boolArray: (v: string): boolean[] =>
    decodeURIComponent(v)
      .split(/ ?,/)
      .map((item) => item === 'true'),
};

export const zDecoder = {
  num: () =>
    z
      .string()
      .transform((v) => decoder.num(v))
      .pipe(z.number()),
  str: () =>
    z
      .string()
      .transform((v) => decoder.str(v))
      .pipe(z.string()),
  bool: () =>
    z
      .string()
      .transform((v) => decoder.bool(v))
      .pipe(z.boolean()),
  enum: <U extends string, T extends Readonly<[U, ...U[]]>>(valueType: T) =>
    z
      .string()
      .transform((v) => decoder.str(v))
      .pipe(z.enum(valueType)),
  numArray: () =>
    z
      .string()
      .transform((v) => decoder.numArray(v))
      .pipe(z.array(z.number())),
  strArray: () =>
    z
      .string()
      .transform((v) => decoder.strArray(v))
      .pipe(z.array(z.string())),
  boolArray: () =>
    z
      .string()
      .transform((v) => decoder.boolArray(v))
      .pipe(z.array(z.boolean())),
};
