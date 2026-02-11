"use client";

import { ReactNode, useEffect, useState } from "react";
import Icon from "./Icon";
import Button from "./Button";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
  overflowVisible?: boolean;
}

const Sheet = ({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-xl",
  className = "",
  overflowVisible = false,
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
    <div className={`fixed inset-0 z-100 w-full h-dvh flex items-center justify-center p-4 sm:p-6 overflow-visible`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-invert/64 backdrop-blur-lg ${isExiting ? "animate-backdrop-exit" : "animate-backdrop"}`}
        onClick={onClose}
      />

      {/* Content Sheet */}
      <div
        onAnimationEnd={handleAnimationEnd}
        className={`
          relative w-full ${maxWidth} bg-surface rounded-[42px] shadow-2xl ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'}
          flex flex-col max-h-[90vh] transition-all duration-300 ease-out
          ${isExiting ? "animate-sheet-exit" : "animate-sheet"}
          ${className}
        `}
      >
        {/* Close Button */}
        <Button onClick={onClose} icon="x" className="absolute top-5 left-5 z-20 w-10 h-10 bg-surface-muted text-invert/40" />
        {children}
      </div>
    </div>
  );
};

export default Sheet;
