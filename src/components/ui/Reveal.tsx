'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger index — multiplies the base delay. */
  index?: number;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

/**
 * Scroll-reveal wrapper. Collapses to a plain fade (and then to nothing) when
 * the user prefers reduced motion.
 */
export function Reveal({ children, index = 0, delay = 0, y = 24, className, once = true }: Props) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0.01 : 0.7,
        delay: reduce ? 0 : delay + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word headline reveal. Renders the full text for screen readers and
 * for users who prefer reduced motion.
 */
export function RevealText({
  text,
  className,
  as: Tag = 'h2',
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
        className="inline"
      >
        {/*
          The separator below must stay a plain U+0020. It was a non-breaking
          space, which serialises to &nbsp; and left the heading unable to wrap
          — it ran straight off the side of a phone screen.
        */}
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '110%' },
                show: { y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
