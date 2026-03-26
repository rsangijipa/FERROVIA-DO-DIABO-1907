import clsx from "clsx";
import { CircleHelp, Heart, Landmark, ShieldPlus, Wallet, Wrench } from "lucide-react";

import type { Resources } from "@/types/game";

interface ResourceIconProps {
  resource: keyof Resources;
  size?: number;
  className?: string;
}

const iconMap: Record<keyof Resources, React.ElementType> = {
  orcamento: Wallet,
  moral: Heart,
  saudeSanitaria: ShieldPlus,
  progressoTecnico: Wrench,
  preservacao: Landmark,
};

export function ResourceIcon({ resource, size = 18, className }: ResourceIconProps) {
  const Icon = iconMap[resource] || CircleHelp;

  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-[color:rgba(197,154,93,0.22)] bg-[color:rgba(233,223,201,0.07)] p-1",
        className,
      )}
      aria-hidden="true"
    >
      <Icon size={size} className="text-[color:var(--color-rust)] opacity-90" />
    </span>
  );
}
