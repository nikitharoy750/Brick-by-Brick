"use client";

import { motion } from "framer-motion";
import "./BrickPreview.css";

type BrickPreviewProps = {
  colour: string;
  size: number;
  finish: string;
};

export default function BrickPreview({
  colour,
  size,
  finish,
}: BrickPreviewProps) {
  // Keep the existing page API intact:
  // Small = 0.8, Medium = 1, Large = 1.2
  const scale = size || 1;

  const textureClass =
    finish === "Rough"
      ? "brick-preview--rough"
      : finish === "Textured"
        ? "brick-preview--textured"
        : "";

  return (
    <motion.div
      className="brick-preview-wrap"
      style={
        {
          "--brick-scale": scale,
          "--brick-colour": colour || "#B85C3B",
        } as React.CSSProperties
      }
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 20,
      }}
    >
      <div className={`brick-preview ${textureClass}`}>
        {/* Irregular dark outline */}
        <div className="brick-preview__outline">
          {/* Main flat brick face */}
          <div className="brick-preview__face">
            {/* Muted pixel highlights */}
            <span className="brick-patch brick-patch--light-1" />
            <span className="brick-patch brick-patch--light-2" />
            <span className="brick-patch brick-patch--light-3" />

            {/* Dark reddish-brown pixel patches */}
            <span className="brick-patch brick-patch--dark-1" />
            <span className="brick-patch brick-patch--dark-2" />
            <span className="brick-patch brick-patch--dark-3" />

            {/* Small edge cutouts / irregularities */}
            <span className="brick-notch brick-notch--top" />
            <span className="brick-notch brick-notch--right" />
            <span className="brick-notch brick-notch--bottom" />
            <span className="brick-notch brick-notch--left" />

            {/* Very subtle flat surface texture */}
            <span className="brick-surface" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
