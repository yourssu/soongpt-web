import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * DOM 클래스 이름들을 받아서,
 * - 중복 클래스 이름을 제거해요.
 * - 조건부 클래스 이름을 처리해요.
 */
export const cn = (...v: ClassValue[]) => {
  return twMerge(clsx(v));
};
