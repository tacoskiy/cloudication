import React from "react";
import type { SVGProps } from "react";

import { IconPaths, type IconName } from "./paths";

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number | string;
  title?: string;
  viewBox?: string;
}

const Icon = React.memo(
  ({ name, size = 24, title, className, viewBox, ...props }: IconProps) => {
    const px = typeof size === "number" ? `${size}px` : size;

    return (
      <svg
        width={px}
        height={px}
        viewBox={viewBox ?? "0 0 20 20"}
        role={title ? "img" : "presentation"}
        aria-hidden={!title}
        fill="currentColor"
        className={`inline-block ${className ?? ""}`}
        {...props}
      >
        {title && <title>{title}</title>}
        <path d={IconPaths[name]} />
      </svg>
    );
  }
);

Icon.displayName = "Icon";

export default Icon;
