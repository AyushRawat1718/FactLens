import React from "react";
import { motion } from "framer-motion";

const variants = {
  up: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1 },
  },
};

// Scroll-triggered reveal wrapper. Wraps framer-motion so every section
// gets consistent fade/blur/scale-in behavior with a one-line API:
//   <Reveal variant="scale" delay={100}>...</Reveal>
export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  as = "div",
  className = "",
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants[variant]}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.2, 0.65, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
