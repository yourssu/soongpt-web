import { HTMLMotionProps, motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface RollingNumberProps extends HTMLMotionProps<'span'> {
  decimals: number;
  number: number;
}

const RollingNumber = ({ number, decimals, ...props }: RollingNumberProps) => {
  const springValue = useSpring(number, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const displayNumber = useTransform(springValue, (latest) => {
    const factor = Math.pow(10, decimals);
    return (Math.round(latest * factor) / factor).toFixed(decimals);
  });

  useEffect(() => {
    springValue.set(number);
  }, [number, springValue]);

  return <motion.span {...props}>{displayNumber}</motion.span>;
};

export default RollingNumber;
