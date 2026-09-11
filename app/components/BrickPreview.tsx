"use client";

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
  /*
   * The page sends:
   * Small  = 0.8
   * Medium = 1
   * Large  = 1.2
   *
   * Use the number directly as a scale so all three sizes
   * stay proportional instead of treating 0.8/1.2 as unknown sizes.
   */

  const width = 180 * size;
  const height = 75 * size;

  const texture =
    finish === "Rough"
      ? {
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.08) 1px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px, 17px 17px",
        }
      : finish === "Textured"
        ? {
            backgroundImage: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.12) 25%,
                transparent 25%,
                transparent 50%,
                rgba(0,0,0,0.06) 50%,
                rgba(0,0,0,0.06) 75%,
                transparent 75%
              )
            `,
            backgroundSize: "18px 18px",
          }
        : {};

  return (
    <div
      className="relative shrink-0 m-0 p-0"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Shadow */}
      <div
        className="absolute rounded-full bg-black/10 blur-md"
        style={{
          left: `${8 * size}%`,
          bottom: `${-4 * size}px`,
          width: `${84 * size}%`,
          height: `${5 * size}px`,
        }}
      />

      {/* Brick */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[14px] border-2 border-black/10 shadow-[8px_9px_0_rgba(0,0,0,0.12)]"
        style={{
          backgroundColor: colour || "#F26B6B",
          ...texture,
        }}
      >
        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-[38%] bg-white/10" />

        {/* Main highlight */}
        <div
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${16 * size}px`,
            top: `${10 * size}px`,
            width: `${70 * size}px`,
            height: `${8 * size}px`,
          }}
        />

        {/* Bottom shading */}
        <div className="absolute inset-x-0 bottom-0 h-[28%] bg-black/10" />
      </div>
    </div>
  );
}
