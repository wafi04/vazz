"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ParticlesEffect() {
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.2 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: i % 5 === 0 ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: particle.delay,
          }}
          className={cn(
            "absolute block rounded-full",
            i % 3 === 0 ? "bg-blue-400 w-1 h-1" : "bg-blue-200 w-0.5 h-0.5"
          )}
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
          }}
        />
      ))}
    </div>
  );
}
