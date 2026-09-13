"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
};

export default function RealisticButton({ children, href, onClick, className = "", icon }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function move(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - 0.5) * -7,
      y: ((event.clientX - rect.left) / rect.width - 0.5) * 9,
    });
  }

  const content = (
    <>
      <span className="realistic-button-shine" />
      {icon ? <span className="realistic-button-icon">{icon}</span> : null}
      <span className="relative z-10">{children}</span>
    </>
  );

  return (
    <motion.div
      ref={ref}
      className="magnetic-target relative inline-block transform-gpu"
      onMouseMove={move}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      style={{ perspective: 600, transformStyle: "preserve-3d" }}
      whileTap={{ scale: 0.96 }}
    >
      {href ? (
        <Link href={href} className={`realistic-button ${className}`}>{content}</Link>
      ) : (
        <button type="button" onClick={onClick} className={`realistic-button ${className}`}>{content}</button>
      )}
    </motion.div>
  );
}
