"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrickPreview from "./components/BrickPreview";
import OpeningAnimation from "./components/OpeningAnimation";

const concepts = [
  "Unhinged",
  "Educational",
  "Relatable",
  "Sarcastic",
  "Main Character",
  "Delusional",
  "Sigma",
  "Dark Humour",
  "Brainrot",
  "Aesthetics",
  "Food Obsession",
  "Animals",
  "Cinematic",
  "Romance",
  "Gaming",
  "Outfits / Accessories",
  "Meme",
  "Other",
];

const brickColours = [
  { name: "Coral", value: "#F26B6B" },
  { name: "Pink", value: "#F58BA8" },
  { name: "Peach", value: "#F5A06B" },
  { name: "Yellow", value: "#F4C95D" },
  { name: "Mint", value: "#78C8A3" },
  { name: "Blue", value: "#6EA8E8" },
  { name: "Lavender", value: "#9B82D8" },
  { name: "Cream", value: "#E9DED0" },
];

const brickSizes = [
  { name: "Small", value: 0.8 },
  { name: "Medium", value: 1 },
  { name: "Large", value: 1.2 },
];

type Brick = {
  id: number;
  url: string;
  concepts: string[];
  customConcept?: string;
  colour: string;
  finish: string;
  size: number;
};

type AlgorithmResult = {
  personality: string;
  description: string;
  roast: string;
  topCombination: string;
  delusionScore: number;
  brainrotScore: number;
  mainCharacterScore: number;
  usefulScore: number;
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [bricks, setBricks] = useState<Brick[]>([]);

  const [reelUrl, setReelUrl] = useState("");
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [customConcept, setCustomConcept] = useState("");

  const [selectedColour, setSelectedColour] = useState("#F26B6B");
  const [selectedFinish, setSelectedFinish] = useState("Smooth");
  const [selectedSize, setSelectedSize] = useState(1);

  const [isBuilding, setIsBuilding] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [deletingBrickId, setDeletingBrickId] = useState<number | null>(null);

  // ADD BRICK animation states
  const [isAddingBrick, setIsAddingBrick] = useState(false);
  const [newBrickId, setNewBrickId] = useState<number | null>(null);
  const [showBrickAdded, setShowBrickAdded] = useState(false);
  const [draggedBrickId, setDraggedBrickId] = useState<number | null>(null);
  const [dragOverBrickId, setDragOverBrickId] = useState<number | null>(null);

  function moveBrick(draggedId: number, targetId: number) {
    if (draggedId === targetId) return;
    setBricks((currentBricks) => {
      const fromIndex = currentBricks.findIndex((brick) => brick.id === draggedId);
      const toIndex = currentBricks.findIndex((brick) => brick.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return currentBricks;
      const next = [...currentBricks];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function handleDragEnd() {
    setDraggedBrickId(null);
    setDragOverBrickId(null);
  }

  const buildSectionRef = useRef<HTMLElement | null>(null);
  const wallSectionRef = useRef<HTMLDivElement | null>(null);
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);

  function scrollToSection(
    sectionRef: React.RefObject<HTMLElement | null>
  ) {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function toggleConcept(item: string) {
    setSelectedConcepts((currentConcepts) =>
      currentConcepts.includes(item)
        ? currentConcepts.filter((concept) => concept !== item)
        : [...currentConcepts, item]
    );
  }

  function addBrick() {
    if (
      !reelUrl.trim() ||
      selectedConcepts.length === 0 ||
      (selectedConcepts.includes("Other") && !customConcept.trim())
    ) {
      return;
    }

    if (isAddingBrick) return;

    const brickId = Date.now();

    const newBrick: Brick = {
      id: brickId,
      url: reelUrl,
      concepts: selectedConcepts,
      customConcept: selectedConcepts.includes("Other")
        ? customConcept.trim()
        : "",
      colour: selectedColour,
      finish: selectedFinish,
      size: selectedSize,
    };

    // Start the visual "brick flying into the wall" animation first.
    setIsAddingBrick(true);
    setNewBrickId(brickId);
    setShowBrickAdded(false);

    setTimeout(() => {
      setBricks((currentBricks) => [...currentBricks, newBrick]);

      // Clear the form after the brick has landed.
      setReelUrl("");
      setSelectedConcepts([]);
      setCustomConcept("");

      setIsAddingBrick(false);
      setShowBrickAdded(true);

      // Remove the "BRICK ADDED" message after a moment.
      setTimeout(() => {
        setShowBrickAdded(false);
      }, 1400);

      // Remove the new-brick highlight after the wall settles.
      setTimeout(() => {
        setNewBrickId(null);
      }, 1100);
    }, 800);
  }

  function deleteBrick(id: number) {
    setDeletingBrickId(id);

    setTimeout(() => {
      setBricks((currentBricks) =>
        currentBricks.filter((brick) => brick.id !== id)
      );
      setDeletingBrickId(null);
    }, 650);
  }

  async function buildAlgorithm() {
    if (bricks.length === 0 || isBuilding) return;

    setAnalysisStarted(true);
    setShowResult(false);
    setAnalysisError(null);
    setIsBuilding(true);
    setAnalysisStep(1);

    const startedAt = Date.now();

    // Keep the funny analysis messages moving while Gemini works.
    const stepTimer = window.setInterval(() => {
      setAnalysisStep((currentStep) => Math.min(currentStep + 1, 6));
    }, 1500);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bricks,
          reelUrl,
          caption: "",
          hashtags: [],
          audioTranscript: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze the algorithm.");
      }

      const result: AlgorithmResult = {
        personality: data.personality,
        description: data.description,
        roast: data.roast,
        topCombination: data.topCombination,
        delusionScore: Number(data.delusion),
        brainrotScore: Number(data.brainrot),
        mainCharacterScore: Number(data.mainCharacter),
        usefulScore: Number(data.usefulContent),
      };

      setAlgorithmResult(result);

      // Give the loading animation enough time to show all six messages.
      const elapsed = Date.now() - startedAt;
      const minimumLoadingTime = 9000;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsed);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setAnalysisStep(6);
      setIsBuilding(false);
      setShowResult(true);
    } catch (error) {
      console.error("Algorithm analysis error:", error);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your bricks."
      );
      setIsBuilding(false);
    } finally {
      window.clearInterval(stepTimer);
    }
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <OpeningAnimation
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>


      <main className="min-h-screen bg-transparent text-[#252525]">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-[#D9D1C5] bg-[#FFFDF9] px-6 py-4">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: selectedColour }}
            >
              <div className="h-5 w-7 rounded-sm bg-white/30" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                BRICK BY BRICK
              </h1>

              <p className="text-xs text-[#77716A]">
                Turning your reels into algorithms
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <button className="text-[#252525]">Home</button>
            <button
              onClick={() => scrollToSection(buildSectionRef)}
              className="text-[#77716A] transition hover:text-[#252525]"
            >
              Build
            </button>
            <button
              onClick={() => scrollToSection(wallSectionRef)}
              className="text-[#77716A] transition hover:text-[#252525]"
            >
              My Wall
            </button>
            <button
              onClick={() => scrollToSection(aboutSectionRef)}
              className="text-[#77716A] transition hover:text-[#252525]"
            >
              About
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9D1C5] bg-[#F5F1EA]">
              <div className="h-4 w-4 rounded-full bg-[#77716A]" />
            </div>
          </div>

        </div>

      </nav>


      {/* ================= DASHBOARD ================= */}

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-5 p-5 lg:grid-cols-12">


        {/* ================= LEFT PANEL ================= */}

        <aside className="rounded-3xl border border-[#D9D1C5] bg-[#FFFDF9] p-6 shadow-sm lg:col-span-3">

          <div className="mb-6">

            <h2 className="text-xl font-black">
              CUSTOMISE YOUR BRICK
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#77716A]">
              Make your brick look as questionable as your algorithm.
            </p>

          </div>


          {/* Brick Preview */}

          <div className="flex h-52 items-center justify-center rounded-2xl bg-[#F5F1EA]">
            <BrickPreview
              colour={selectedColour}
              size={selectedSize}
              finish={selectedFinish}
            />
          </div>


          {/* Colour */}

          <div className="mt-7">

            <h3 className="text-sm font-bold">
              BRICK COLOUR
            </h3>

            <div className="mt-3 grid grid-cols-8 gap-2">

              {brickColours.map((colour) => (

                <button
                  key={colour.name}
                  title={colour.name}
                  onClick={() => setSelectedColour(colour.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColour === colour.value
                      ? "scale-110 border-[#252525]"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: colour.value }}
                />

              ))}

            </div>

          </div>


          {/* Finish */}

          <div className="mt-7">

            <h3 className="text-sm font-bold">
              BRICK FINISH
            </h3>

            <div className="mt-3 grid grid-cols-3 gap-2">

              {["Smooth", "Rough", "Textured"].map((finish) => (

                <button
                  key={finish}
                  onClick={() => setSelectedFinish(finish)}
                  className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                    selectedFinish === finish
                      ? "border-[#252525] bg-[#252525] text-white"
                      : "border-[#D9D1C5] bg-[#FFFDF9] text-[#55504A]"
                  }`}
                >
                  {finish}
                </button>

              ))}

            </div>

          </div>


          {/* Size */}

          <div className="mt-7">

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-bold">
                BRICK SIZE
              </h3>

              <span className="text-xs text-[#77716A]">
                {selectedSize === 0.8
                  ? "Small"
                  : selectedSize === 1.2
                  ? "Large"
                  : "Medium"}
              </span>

            </div>

            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.2"
              value={selectedSize}
              onChange={(event) =>
                setSelectedSize(Number(event.target.value))
              }
              className="mt-4 w-full accent-[#F26B6B]"
            />

          </div>


          <button className="mt-8 w-full rounded-2xl bg-[#F58BA8] py-4 text-sm font-black shadow-[0_4px_0_#D86F8B] transition hover:translate-y-[2px] hover:shadow-[0_2px_0_#D86F8B]">
            SAVE BRICK DESIGN
          </button>

        </aside>



        {/* ================= CENTRE PANEL ================= */}

        <section
          ref={buildSectionRef}
          className="relative scroll-mt-24 rounded-3xl border border-[#D9D1C5] bg-[#FFFDF9] p-6 shadow-sm lg:col-span-6"
        >

          {/* ================= ADD BRICK FLIGHT ANIMATION ================= */}
          <AnimatePresence>
            {isAddingBrick && (
              <motion.div
                initial={{
                  opacity: 0,
                  left: "19%",
                  top: "150px",
                  scale: 0.72,
                  rotate: -8,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  left: ["19%", "28%", "46%", "50%"],
                  top: ["150px", "210px", "390px", "560px"],
                  scale: [0.72, 0.92, 0.78, 0.55],
                  rotate: [-8, 8, -4, 10],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  times: [0, 0.18, 0.72, 1],
                }}
                className="pointer-events-none absolute z-50 hidden -translate-x-1/2 lg:block"
              >
                <div className="relative">
                  <BrickPreview
                    colour={selectedColour}
                    size={1}
                    finish={selectedFinish}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 1.3] }}
                    transition={{ duration: 0.35, delay: 0.45 }}
                    className="absolute inset-0 rounded-xl border-2 border-white/70"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showBrickAdded && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute left-1/2 top-5 z-40 -translate-x-1/2 rounded-full bg-[#252525] px-4 py-2 text-xs font-black tracking-widest text-white shadow-lg"
              >
                BRICK ADDED
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6">

            <h2 className="text-2xl font-black">
              ADD YOUR REELS
            </h2>

            <p className="mt-2 text-sm text-[#77716A]">
              Every reel is a brick. Let&apos;s stack your algorithm.
            </p>

          </div>


          {/* Reel Input */}

          <div className="rounded-2xl border border-[#D9D1C5] bg-[#F9F6F0] p-4">

            <div className="grid gap-3 md:grid-cols-[1fr_220px]">

              <input
                type="text"
                value={reelUrl}
                onChange={(event) => setReelUrl(event.target.value)}
                placeholder="Paste Instagram Reel link..."
                className="rounded-xl border border-[#D9D1C5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#F26B6B]"
              />

              <div className="rounded-xl border border-[#D9D1C5] bg-white p-3">
                <p className="mb-2 text-xs font-bold text-[#55504A]">
                  WHAT&apos;S INSIDE THIS BRICK?
                </p>

                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                  {concepts.map((item) => {
                    const isSelected = selectedConcepts.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleConcept(item)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? "border-[#252525] bg-[#252525] text-white"
                            : "border-[#D9D1C5] bg-[#FFFDF9] text-[#55504A] hover:border-[#F26B6B]"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2 text-[11px] text-[#77716A]">
                  Select as many concepts as fit the Reel.
                </p>
              </div>

            </div>


            {/* Other */}

            {selectedConcepts.includes("Other") && (

              <input
                type="text"
                value={customConcept}
                onChange={(event) => setCustomConcept(event.target.value)}
                placeholder="Describe the Reel in your own words..."
                className="mt-3 w-full rounded-xl border border-[#D9D1C5] bg-white px-4 py-3 text-sm outline-none focus:border-[#F26B6B]"
              />

            )}


            <motion.button
              onClick={addBrick}
              disabled={
                isAddingBrick ||
                !reelUrl.trim() ||
                selectedConcepts.length === 0 ||
                (selectedConcepts.includes("Other") && !customConcept.trim())
              }
              whileTap={{ scale: 0.95, y: 2 }}
              animate={
                isAddingBrick
                  ? { scale: [1, 0.96, 1], rotate: [0, -1, 1, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={
                isAddingBrick
                  ? { duration: 0.3, repeat: 1 }
                  : { duration: 0.15 }
              }
              className="mt-3 rounded-xl bg-[#F58BA8] px-6 py-3 text-sm font-black shadow-[0_3px_0_#D86F8B] transition hover:translate-y-[2px] hover:shadow-[0_1px_0_#D86F8B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAddingBrick ? "BUILDING BRICK..." : "ADD BRICK"}
            </motion.button>

          </div>


          {/* Your Brick Wall */}

          {bricks.length > 0 && (

            <div
              ref={wallSectionRef}
              className="mt-6 scroll-mt-24 overflow-hidden rounded-2xl border border-[#D9D1C5] bg-[#E7DED2] p-4 shadow-inner"
            >

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black tracking-widest text-[#55504A]">
                    YOUR BRICK WALL
                  </p>
                  <p className="mt-1 text-[11px] text-[#77716A]">
                    Every Reel becomes part of your algorithm.
                  </p>
                </div>

                <motion.span
                  key={`badge-${bricks.length}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.08, 1] }}
                  transition={{ duration: 0.35 }}
                  className="rounded-full bg-[#FFFDF9] px-3 py-1 text-[11px] font-black text-[#55504A]"
                >
                  {bricks.length} BRICKS
                </motion.span>
              </div>

              <div className="min-h-[240px] rounded-xl border border-black/5 bg-[#D7CABB] p-4">
                <div className="m-0 flex flex-col gap-0 p-0">
                  <AnimatePresence mode="popLayout">
                    {Array.from(
                      { length: Math.ceil(bricks.length / 3) },
                      (_, rowIndex) => (
                        <motion.div
                          key={`row-${rowIndex}`}
                          layout
                          className="m-0 flex h-[75px] items-start gap-0 p-0"
                          style={{
                            marginLeft: rowIndex % 2 === 1 ? 90 : 0,
                          }}
                        >
                          {bricks
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((brick) => (
                              <motion.div
                                key={`wall-${brick.id}`}
                                layout
                                draggable
                                onDragStartCapture={(event) => {
                                  event.dataTransfer.effectAllowed = "move";
                                  event.dataTransfer.setData("text/plain", String(brick.id));
                                  setDraggedBrickId(brick.id);
                                }}
                                onDragOverCapture={(event) => {
                                  event.preventDefault();
                                  event.dataTransfer.dropEffect = "move";
                                  if (draggedBrickId !== brick.id) {
                                    setDragOverBrickId(brick.id);
                                  }
                                }}
                                onDragLeave={() => {
                                  if (dragOverBrickId === brick.id) setDragOverBrickId(null);
                                }}
                                onDropCapture={(event) => {
                                  event.preventDefault();
                                  const draggedId = Number(event.dataTransfer.getData("text/plain"));
                                  if (draggedId) moveBrick(draggedId, brick.id);
                                  handleDragEnd();
                                }}
                                onDragEndCapture={handleDragEnd}
                                initial={{
                                  opacity: 0,
                                  y: -80,
                                  rotate: -8,
                                  scale: 0.8,
                                }}
                                animate={
                                  deletingBrickId === brick.id
                                    ? {
                                        opacity: 1,
                                        y: [0, -4, 0],
                                        rotate: [0, -2, 2, 0],
                                        scale: [1, 1.03, 0.98, 1],
                                      }
                                    : newBrickId === brick.id
                                    ? {
                                        opacity: 1,
                                        y: [0, -8, 0],
                                        rotate: [0, -3, 3, 0],
                                        scale: [1, 1.08, 0.97, 1],
                                      }
                                    : {
                                        opacity: 1,
                                        y: 0,
                                        rotate: 0,
                                        scale: 1,
                                      }
                                }
                                exit={{
                                  opacity: 0,
                                  y: 100,
                                  rotate: 18,
                                  scale: 0.65,
                                }}
                                transition={
                                  deletingBrickId === brick.id
                                    ? {
                                        duration: 0.35,
                                        ease: "easeInOut",
                                      }
                                    : newBrickId === brick.id
                                    ? {
                                        duration: 0.55,
                                        ease: "easeOut",
                                      }
                                    : {
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 18,
                                      }
                                }
                                whileHover={{
                                  y: -5,
                                  rotate: -2,
                                }}
                                title={brick.concepts.join(" • ")}
                                className={`m-0 -mr-[1px] h-[75px] w-[179px] shrink-0 cursor-grab p-0 select-none active:cursor-grabbing ${
                                  draggedBrickId === brick.id ? "z-30 opacity-50" : ""
                                } ${
                                  dragOverBrickId === brick.id ? "rounded-xl ring-2 ring-[#F4C95D] ring-offset-2" : ""
                                }`}
                              >
                                <div className="relative m-0 h-[75px] w-[180px] p-0">
                                  <BrickPreview
                                    colour={brick.colour}
                                    size={1}
                                    finish={brick.finish}
                                  />

                                  <AnimatePresence>
                                    {deletingBrickId === brick.id && (
                                      <motion.svg
                                        viewBox="0 0 100 60"
                                        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                      >
                                        <motion.path
                                          d="M50 2 L46 17 L53 27 L43 39 L48 57"
                                          fill="none"
                                          stroke="#3A2525"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{
                                            duration: 0.35,
                                            ease: "easeOut",
                                          }}
                                        />
                                        <motion.path
                                          d="M47 17 L31 12 M53 27 L68 20 M43 39 L27 43 M48 57 L63 51"
                                          fill="none"
                                          stroke="#3A2525"
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{
                                            duration: 0.3,
                                            delay: 0.12,
                                            ease: "easeOut",
                                          }}
                                        />
                                      </motion.svg>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>
                            ))}
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          )}


          {/* Brick List */}

          <div className="mt-6 space-y-3">

            {bricks.length === 0 ? (

              <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D9D1C5]">

                <div className="text-5xl font-light text-[#AAA39A]">
                  +
                </div>

                <h3 className="mt-3 text-sm font-black">
                  ADD YOUR FIRST BRICK
                </h3>

                <p className="mt-2 text-xs text-[#77716A]">
                  The more bricks, the better the roast.
                </p>

              </div>

            ) : (

              bricks.map((brick, index) => (

                <motion.div
                  key={brick.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: 80,
                    scale: 0.95,
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 rounded-2xl border border-[#D9D1C5] bg-[#F9F6F0] p-3"
                >

                  {/* Mini Brick */}

                  <div className="flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E7DED2]">
                    <div style={{ transform: `scale(${0.34 * brick.size})` }}>
                      <BrickPreview
                        colour={brick.colour}
                        size={1}
                        finish={brick.finish}
                      />
                    </div>
                  </div>


                  {/* Number */}

                  <span className="w-6 text-xs font-bold text-[#77716A]">
                    {String(index + 1).padStart(2, "0")}
                  </span>


                  {/* URL */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-xs text-[#77716A]">
                      {brick.url}
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {brick.concepts.join(" • ")}
                      {brick.customConcept && (
                        <span className="text-[#77716A]">
                          {" "}• {brick.customConcept}
                        </span>
                      )}
                    </p>

                  </div>


                  {/* Delete */}

                  <button
                    onClick={() => deleteBrick(brick.id)}
                    className="rounded-lg border border-[#D9D1C5] px-3 py-2 text-xs font-bold text-[#77716A] transition hover:border-red-300 hover:text-red-500"
                  >
                    DELETE
                  </button>

                </motion.div>

              ))

            )}

          </div>


          {/* Add Another */}

          {bricks.length > 0 && (

            <button
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>(
                    'input[placeholder="Paste Instagram Reel link..."]'
                  )
                  ?.focus()
              }
              className="mt-4 w-full rounded-2xl border-2 border-dashed border-[#D9D1C5] py-5 text-sm font-bold text-[#77716A] transition hover:border-[#F26B6B] hover:text-[#252525]"
            >
              + ADD ANOTHER BRICK
            </button>

          )}


          {/* Build */}

          <button
            onClick={buildAlgorithm}
            disabled={bricks.length === 0 || isBuilding}
            className="mt-6 w-full rounded-2xl bg-[#F4C95D] py-4 text-lg font-black shadow-[0_5px_0_#D5A938] transition hover:translate-y-[2px] hover:shadow-[0_3px_0_#D5A938] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBuilding ? "BUILDING YOUR ALGORITHM..." : "BUILD MY ALGORITHM"}
          </button>

          <p className="mt-3 text-center text-xs italic text-[#77716A]">
            Careful... it might reveal too much about you.
          </p>

        </section>



        {/* ================= RIGHT PANEL ================= */}

        <aside className="space-y-5 lg:col-span-3">


          {/* Inventory */}

          <div className="rounded-3xl border border-[#D9D1C5] bg-[#FFFDF9] p-6 shadow-sm">

            <h2 className="text-xl font-black">
              YOUR BRICK INVENTORY
            </h2>


            <div className="mt-6 flex items-end gap-3">

              <motion.span
                key={bricks.length}
                initial={{ scale: 1.35, y: -8 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="text-6xl font-black"
              >
                {bricks.length}
              </motion.span>

              <span className="mb-2 text-sm font-bold leading-tight text-[#77716A]">
                BRICKS
                <br />
                COLLECTED
              </span>

            </div>


            {/* Stats */}

            <div className="mt-7 space-y-5">

              <div>

                <div className="flex justify-between text-xs font-bold">
                  <span>Structural Integrity</span>
                  <span>61%</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div className="h-full w-[61%] rounded-full bg-[#F26B6B]" />
                </div>

              </div>


              <div>

                <div className="flex justify-between text-xs font-bold">
                  <span>Mental Stability</span>
                  <span>23%</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div className="h-full w-[23%] rounded-full bg-[#F58BA8]" />
                </div>

              </div>


              <div>

                <div className="flex justify-between text-xs font-bold">
                  <span>Algorithmic Potential</span>
                  <span>???</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div className="h-full w-[48%] rounded-full bg-[#9B82D8]" />
                </div>

              </div>


              <div>

                <div className="flex justify-between text-xs font-bold">
                  <span>Useful Content</span>
                  <span>0.4%</span>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div className="h-full w-[4%] rounded-full bg-[#F4C95D]" />
                </div>

              </div>

            </div>


            <p className="mt-6 text-center text-xs italic text-[#77716A]">
              A very questionable collection.
            </p>

          </div>



          {/* Analysis */}

          {analysisStarted && !showResult && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl bg-[#24272C] p-6 text-white shadow-sm"
            >

              <h2 className="text-lg font-black">
                ANALYSING YOUR ALGORITHM...
              </h2>

              {analysisError && (
                <div className="mt-4 rounded-2xl bg-[#3A2525] p-4 text-xs font-bold text-[#FFB4B4]">
                  {analysisError}
                </div>
              )}

              <div className="mt-5 min-h-[170px] space-y-3 text-xs leading-relaxed text-[#D6D6D6]">

                {analysisStep >= 1 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    • Loading bricks...
                  </motion.p>
                )}

                {analysisStep >= 2 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    • Establishing brick dependency...
                  </motion.p>
                )}

                {analysisStep >= 3 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    • Calculating usefulness...
                  </motion.p>
                )}

                {analysisStep >= 4 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    • Recalculating usefulness...
                  </motion.p>
                )}

                {analysisStep >= 5 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    • Error: usefulness not found.
                  </motion.p>
                )}

                {analysisStep >= 6 && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    • Continuing anyway...
                  </motion.p>
                )}

              </div>

            </motion.div>
          )}

          {showResult && algorithmResult && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="overflow-hidden rounded-3xl border border-[#D9D1C5] bg-[#FFFDF9] shadow-sm"
            >

              <div className="bg-[#24272C] p-6 text-white">
                <p className="text-xs font-black tracking-[0.2em] text-[#F4C95D]">
                  YOUR ALGORITHM
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                  {algorithmResult.personality}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#D6D6D6]">
                  {algorithmResult.description}
                </p>
              </div>

              <div className="p-6">

                <p className="text-xs font-black tracking-widest text-[#77716A]">
                  ALGORITHM BREAKDOWN
                </p>

                <div className="mt-4 space-y-4">

                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Delusion</span>
                      <span>{algorithmResult.delusionScore}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E8E2D9]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${algorithmResult.delusionScore}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-[#F58BA8]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Brainrot</span>
                      <span>{algorithmResult.brainrotScore}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E8E2D9]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${algorithmResult.brainrotScore}%` }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="h-full rounded-full bg-[#9B82D8]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Main Character Energy</span>
                      <span>{algorithmResult.mainCharacterScore}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E8E2D9]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${algorithmResult.mainCharacterScore}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-full rounded-full bg-[#F4C95D]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span>Useful Content</span>
                      <span>{algorithmResult.usefulScore}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E8E2D9]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${algorithmResult.usefulScore}%` }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                        className="h-full rounded-full bg-[#F26B6B]"
                      />
                    </div>
                  </div>

                </div>

                <div className="mt-6 rounded-2xl bg-[#F5F1EA] p-4">
                  <p className="text-xs font-black tracking-widest text-[#77716A]">
                    YOUR ROAST
                  </p>

                  <p className="mt-2 text-sm font-bold leading-relaxed text-[#252525]">
                    {algorithmResult.roast}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-[#D9D1C5] p-4">
                  <p className="text-xs font-black tracking-widest text-[#77716A]">
                    TOP BRICK COMBINATION
                  </p>

                  <p className="mt-2 text-sm font-black">
                    {algorithmResult.topCombination}
                  </p>
                </div>

              </div>

            </motion.div>
          )}

        </aside>

      </div>

      {/* ================= ABOUT ================= */}

      <div
        ref={aboutSectionRef}
        className="mx-auto max-w-[1500px] scroll-mt-24 px-5 pb-10"
      >
        <section className="rounded-3xl border border-[#D9D1C5] bg-[#FFFDF9] p-8 shadow-sm">
          <p className="text-xs font-black tracking-[0.2em] text-[#77716A]">
            ABOUT BRICK BY BRICK
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Your algorithm, one questionable brick at a time.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#77716A]">
            Add your favourite Reels, turn their concepts into bricks, stack
            them into a wall, and eventually let AI figure out what your
            collection says about your algorithm.
          </p>
        </section>
      </div>

    </main>
    </>
  );
}