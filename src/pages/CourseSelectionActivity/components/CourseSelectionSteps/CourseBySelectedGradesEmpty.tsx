import { motion } from 'motion/react';

export const CourseBySelectedGradesEmpty = () => {
  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-1 flex-col"
      initial={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex w-full flex-1 place-items-center">
        <div className="flex w-full flex-col place-items-center gap-4">
          <span className="text-xl font-semibold tracking-tighter">
            해당 학년은 전공선택 과목이 없어요.
          </span>
          <img alt="like" src="/images/like.webp" width={100} />
        </div>
      </div>
    </motion.div>
  );
};
