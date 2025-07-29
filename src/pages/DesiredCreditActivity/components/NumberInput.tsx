import { clamp } from '@/utils/number';
import { Merge } from '@/utils/type';

type NumberInputProps = Merge<
  React.InputHTMLAttributes<HTMLInputElement>,
  { max?: number; min?: number; onChange?: (value?: number) => void; value?: number }
>;

const integerParser = (value: string): '' | number =>
  value === '' ? '' : Number(value.replace(/((\.|,)*)/g, ''));

export const NumberInput = ({
  value,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  onChange,
  ...props
}: NumberInputProps) => {
  const stringifiedValue = value !== undefined ? String(clamp(value, min, max)) : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = integerParser(e.target.value);
    if (parsedValue === '' || !isNaN(parsedValue)) {
      onChange?.(parsedValue === '' ? undefined : clamp(parsedValue, min, max));
    }
  };

  return <input {...props} inputMode="numeric" onChange={handleChange} value={stringifiedValue} />;
};
