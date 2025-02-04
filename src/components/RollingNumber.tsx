import { HTMLMotionProps, motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface RollingNumberProps extends HTMLMotionProps<'span'> {
  number: number;
}

const RollingNumber = ({ number, ...props }: RollingNumberProps) => {
  const springValue = useSpring(number, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const displayNumber = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    springValue.set(number);
  }, [number, springValue]);

  return <motion.span {...props}>{displayNumber}</motion.span>;
};

export default RollingNumber;
