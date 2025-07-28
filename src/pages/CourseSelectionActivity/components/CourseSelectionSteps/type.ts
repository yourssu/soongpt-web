export type StepContentType = {
  description?: string;
  image?: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  title: string;
};

export type BaseStepProps = {
  onNextClick: () => void;
};
