export const IS_DEV = process.env.NODE_ENV !== 'production';
export const STAGE: 'alpha' | 'prod' = IS_DEV ? 'alpha' : import.meta.env.VITE_STAGE || 'prod';

export const config = {
  prod: {
    apiUrl: 'https://api.soongpt.yourssu.com/api',
  },
  alpha: {
    apiUrl: 'https://api.dev25-2.soongpt.yourssu.com/api',
  },
}[STAGE];
