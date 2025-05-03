import { cn } from "@/lib/utils";
import {motion} from "framer-motion"
export function ParticlesEffect() {
    return (
        <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: i % 5 === 0 ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
            className={cn(
              "absolute block rounded-full",
              i % 3 === 0 ? "bg-blue-400 w-1 h-1" : "bg-blue-200 w-0.5 h-0.5"
            )}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    )
}