import { motion } from 'motion/react';
import { ReactElement } from 'react';

interface TimetableSelectionViewProps {
  element: ReactElement;
  handleNextClick?: () => void;
  buttonText: string;
  title: string;
  buttonDisabled: boolean;
}

const TimetableSelectionView = ({
  element,
  handleNextClick,
  buttonDisabled,
  buttonText,
  title,
}: TimetableSelectionViewProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-6 flex flex-1 flex-col items-center"
    >
      <h2 className="text-center text-[28px] font-semibold whitespace-pre-wrap">{title}</h2>
      <div className="mt-4 flex w-full flex-1 flex-col px-10 pb-4">{element}</div>
      <div className="sticky bottom-6 flex w-full justify-center">
        <button
          type="button"
          className={`${buttonDisabled ? 'bg-gray-300' : 'bg-primary'} w-50 rounded-2xl py-3.5 font-semibold text-white shadow-sm`}
          onClick={handleNextClick}
          disabled={buttonDisabled}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
};

export default TimetableSelectionView;
