import Image from "next/image";
import clsx from "clsx";

import { resourceIcons, type ResourceIconKey } from "@/content/assetManifest";

interface ResourceIconProps {
  resource: ResourceIconKey;
  size?: number;
  className?: string;
}

export function ResourceIcon({ resource, size = 18, className }: ResourceIconProps) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-[color:rgba(197,154,93,0.22)] bg-[color:rgba(233,223,201,0.07)] p-1",
        className,
      )}
    >
      <Image src={resourceIcons[resource]} alt="" aria-hidden width={size} height={size} className="h-auto w-auto object-contain" />
    </span>
  );
}
