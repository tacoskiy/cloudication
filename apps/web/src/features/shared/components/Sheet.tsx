"use client";

import { ReactNode, useEffect, useState } from "react";
import Icon from "./Icon";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

const Sheet = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = "max-w-xl",
  className = "" 
}: SheetProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (isExiting && e.animationName === "fadeOutDown") {
      setShouldRender(false);
      setIsExiting(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-invert/40 backdrop-blur-xl ${isExiting ? "animate-backdrop-exit" : "animate-backdrop"}`}
        onClick={onClose}
      />

      {/* Content Sheet */}
      <div 
        onAnimationEnd={handleAnimationEnd}
        className={`
          relative w-full ${maxWidth} bg-surface rounded-[42px] shadow-2xl overflow-hidden
          flex flex-col max-h-[90vh] transition-all duration-300 ease-out
          ${isExiting ? "animate-sheet-exit" : "animate-sheet"}
          ${className}
        `}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-2xl bg-invert/5 hover:bg-invert/10 flex items-center justify-center transition-all hover:rotate-90 active:scale-90"
        >
          <Icon name="x" size={20} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Sheet;
