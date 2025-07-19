import { CircleCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface ChapelInputProps {
  initialValue: boolean | undefined;
  onNext: (chapel: boolean) => void;
}

const ChapelInput = ({ onNext, initialValue }: ChapelInputProps) => {
  const [chapel, setChapel] = useState(initialValue ?? true);

  const handleClickChapel = () => {
    setChapel(!chapel);
    onNext(!chapel);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      <label className="mb-1.5 block text-sm">채플 수강 여부</label>

      <button
        className="bg-bg-layerDefault focus-visible:outline-borderRing text-brandPrimary flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold"
        onClick={handleClickChapel}
        type="button"
      >
        {chapel ? '채플 수강' : '채플 미수강'}
        <CircleCheck
          className={`size-6 ${chapel ? 'text-brandPrimary' : 'text-neutralDisabled'}`}
        />
      </button>
    </motion.div>
  );
};

export default ChapelInput;
