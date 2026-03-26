import clsx from "clsx";

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface DecorativeCornerProps {
  position: CornerPosition;
  size?: number;
  className?: string;
}

const positionStyles: Record<CornerPosition, string> = {
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3 -scale-x-100",
  "bottom-left": "bottom-3 left-3 -scale-y-100",
  "bottom-right": "bottom-3 right-3 -scale-x-100 -scale-y-100",
};

export function DecorativeCorner({ position, size = 24, className }: DecorativeCornerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={clsx(
        "pointer-events-none absolute opacity-30",
        positionStyles[position],
        className,
      )}
      aria-hidden
    >
      <path
        d="M1 1v8M1 1h8"
        stroke="var(--color-latao)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M1 1l4 4"
        stroke="var(--color-latao)"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
