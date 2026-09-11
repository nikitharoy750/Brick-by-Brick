"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OpeningAnimationProps = {
  onComplete: () => void;
};

export default function OpeningAnimation({
  onComplete,
}: OpeningAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Start running
    const runTimer = setTimeout(() => {
      setStage(1);
    }, 100);

    // Girls reach the bricks and sit
    const sitTimer = setTimeout(() => {
      setStage(2);
    }, 1800);

    // Finish intro at exactly 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(runTimer);
      clearTimeout(sitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#FFF1F5]"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.35 },
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFE4EC_0%,#FFF1F5_55%,#F9E8EE_100%)]" />

      {/* Decorative running lines */}
      <motion.div
        className="absolute left-[10%] top-[28%] h-1 w-14 rotate-[-12deg] rounded-full bg-[#F58BA8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute right-[10%] top-[28%] h-1 w-14 rotate-[12deg] rounded-full bg-[#F58BA8]"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* =========================
          LEFT GIRL
         ========================= */}

      <AnimatePresence>
        {stage < 2 && (
          <motion.img
            key="left-running"
            src="/intro/girl-left-running.png"
            alt=""
            className="
              absolute
              bottom-[16%]
              left-1/2
              z-20
              w-[165px]
              -translate-x-[105%]
              md:w-[210px]
              lg:w-[235px]
            "
            initial={{
              x: "-60vw",
              opacity: 0,
            }}
            animate={{
              x: "-19vw",
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: {
                duration: 0.18,
                ease: "easeIn",
              },
            }}
            transition={{
              duration: 1.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* LEFT GIRL SITTING */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.img
            key="left-sitting"
            src="/intro/girl-left-sitting.png"
            alt=""
            className="
              absolute
              bottom-[10%]
              left-1/2
              z-30
              w-[165px]
              -translate-x-[105%]
              md:w-[210px]
              lg:w-[235px]
            "
            initial={{
              opacity: 0,
              y: -15,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* =========================
          RIGHT GIRL
         ========================= */}

      <AnimatePresence>
        {stage < 2 && (
          <motion.img
            key="right-running"
            src="/intro/girl-right-running.png"
            alt=""
            className="
              absolute
              bottom-[16%]
              left-1/2
              z-20
              w-[165px]
              translate-x-[5%]
              md:w-[210px]
              lg:w-[235px]
            "
            initial={{
              x: "60vw",
              opacity: 0,
            }}
            animate={{
              x: "19vw",
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: {
                duration: 0.18,
                ease: "easeIn",
              },
            }}
            transition={{
              duration: 1.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* RIGHT GIRL SITTING */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.img
            key="right-sitting"
            src="/intro/girl-right-sitting.png"
            alt=""
            className="
              absolute
              bottom-[10%]
              left-1/2
              z-30
              w-[165px]
              translate-x-[5%]
              md:w-[210px]
              lg:w-[235px]
            "
            initial={{
              opacity: 0,
              y: -15,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* =========================
          BRICKS
         ========================= */}

      <motion.div
        className="
          absolute
          bottom-[8%]
          left-1/2
          z-10
          flex
          -translate-x-1/2
          flex-col
          items-center
        "
        initial={{
          opacity: 0,
          scale: 0.7,
          y: 25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          ease: "easeOut",
        }}
      >
        {/* Top row */}
        <div className="flex gap-1">
          <div className="h-8 w-16 rounded-md bg-[#F58BA8] shadow-md" />
          <div className="h-8 w-16 rounded-md bg-[#F4C95D] shadow-md" />
          <div className="h-8 w-16 rounded-md bg-[#67A8E8] shadow-md" />
        </div>

        {/* Bottom row */}
        <div className="-mt-1 flex gap-1">
          <div className="h-8 w-20 rounded-md bg-[#72C6A3] shadow-md" />
          <div className="h-8 w-20 rounded-md bg-[#F4C95D] shadow-md" />
          <div className="h-8 w-20 rounded-md bg-[#67A8E8] shadow-md" />
        </div>
      </motion.div>

      {/* =========================
          TITLE
         ========================= */}

      <motion.div
        className="absolute top-[10%] z-40 flex flex-col items-center text-center"
        initial={{
          opacity: 0,
          scale: 0.8,
          y: -15,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: "easeOut",
        }}
      >
        <h1 className="text-5xl font-black tracking-tight text-[#E84D78] md:text-6xl lg:text-7xl">
          BRICK
        </h1>

        <div className="text-2xl font-black text-[#F4C95D] md:text-3xl">
          BY
        </div>

        <h1 className="text-5xl font-black tracking-tight text-[#398BE0] md:text-6xl lg:text-7xl">
          BRICK
        </h1>
      </motion.div>

      {/* =========================
          TAGLINE
         ========================= */}

      <motion.div
        className="
          absolute
          top-[43%]
          z-40
          rounded-full
          border-2
          border-[#F58BA8]
          bg-[#FFD4E0]
          px-5
          py-2
          text-center
          shadow-sm
        "
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.5,
        }}
      >
        <p className="text-xs font-bold text-[#8F3154] md:text-sm">
          Turning your reels into algorithms
        </p>
      </motion.div>

      {/* =========================
          LOADING TEXT
         ========================= */}

      <motion.p
        className="
          absolute
          bottom-[3%]
          z-40
          text-xs
          font-bold
          tracking-widest
          text-[#A23A60]
          md:text-sm
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.7,
          duration: 0.4,
        }}
      >
        BUILDING YOUR ALGORITHM...
      </motion.p>
    </motion.div>
  );
}