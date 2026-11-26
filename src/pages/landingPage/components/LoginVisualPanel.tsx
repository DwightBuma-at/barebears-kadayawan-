import { motion } from 'motion/react';
import { LOGIN_CONTENT } from '@/data/login';

export function LoginVisualPanel() {
  return (
    <div className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-white p-4 sm:h-80 sm:p-6 lg:h-dvh lg:p-8">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        src={LOGIN_CONTENT.heroImage}
        alt={LOGIN_CONTENT.heroAlt}
        fetchPriority="high"
        loading="eager"
        className="max-h-full w-full object-contain object-center"
      />
    </div>
  );
}
