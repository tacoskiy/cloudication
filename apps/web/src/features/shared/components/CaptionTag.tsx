"use client";

import Icon from "./Icon";
import { IconName } from "./Icon/paths";

interface CaptionTagProps {
  label: string;
  icon?: IconName;
  className?: string;
}

const CaptionTag = ({ label, icon = "camera", className = "" }: CaptionTagProps) => {
  return (
    <div className={`bg-invert/20 backdrop-blur-md px-4 py-2 rounded-full border border-surface/20 flex items-center gap-2 ${className}`}>
      <Icon name={icon} size={16} className="text-surface" />
      <span className="text-[10px] text-surface font-bold tracking-widest uppercase">{label}</span>
    </div>
  );
};

export default CaptionTag;
