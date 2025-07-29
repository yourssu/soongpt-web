import { Variants } from 'motion/react';

interface UseCourseItemAnimationVariantsProps {
  isSelected: boolean;
  pulse?: boolean;
}

export const useCourseItemAnimationVariants = ({
  pulse,
  isSelected,
}: UseCourseItemAnimationVariantsProps): Variants => {
  /* 
    Todo: pulse를 왜 추가했는지, 무슨 의도인지 모르겠음
  */
  if (pulse) {
    return {
      initial: { borderColor: 'rgba(107, 92, 255, 0)' },
      animate: {
        opacity: [1, 0.5, 1],
        scale: [1, 0.98, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    };
  }

  return {
    initial: { borderColor: 'rgba(107, 92, 255, 0)' },
    animate: {
      borderColor: isSelected ? 'rgba(107, 92, 255, 1)' : 'rgba(107, 92, 255, 0)',
      transition: { duration: 0.1 },
    },
  };
};
