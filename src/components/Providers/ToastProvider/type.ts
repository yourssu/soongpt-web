export type ToastType = 'default' | 'error' | 'success';

export type ToastItem = {
  id: string;
  text: string;
  type: ToastType;
};

export const ToastLottieAssetMap = {
  default: undefined,
  error: '/lotties/error.lottie',
  success: '/lotties/success.lottie',
} as const satisfies Record<ToastType, string | undefined>;
