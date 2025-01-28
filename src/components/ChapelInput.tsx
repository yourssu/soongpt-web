import { CircleCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const ChapelInput = () => {
  const [chapel, setChapel] = useState(true);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      <label className="mb-1.5 block text-sm">채플 수강 여부</label>
      <div
        className="bg-basic-light focus-visible:ring-ring flex w-full items-center justify-between rounded-lg px-4 py-3 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        onClick={() => setChapel(!chapel)}
      >
        <button type="button" className="text-primary text-lg font-semibold">
          {chapel ? '채플 수강' : '채플 미수강'}
        </button>
        <CircleCheck className={`size-6 ${chapel ? 'text-primary' : 'text-placeholder'}`} />
      </div>
    </motion.div>
  );
};

export default ChapelInput;
