'use client';

import { Toggle as ToggleUI } from "@/components/ui/toggle";
import { X } from "lucide-react";
import { useState } from "react";

interface ToggleProps {
    children: React.ReactNode;
    className?: string;
    withCloseIcon?: boolean;
    onPressChange?: () => void;
}

export function Toggle({ children, className, withCloseIcon = false, onPressChange }: ToggleProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <ToggleUI
      pressed={isActive}
      onPressedChange={() => {
        setIsActive(!isActive);
        onPressChange?.();
      }}
      className={`
        transition-all
        border
        p-2
        data-[state=on]:bg-toggle-active-background
        data-[state=off]:bg-toggle-background
        text-primary
        cursor-pointer
        ${className}
      `}
    >
        {children}
      {isActive && withCloseIcon && <X className="w-4 h-4" />}
    </ToggleUI>
  );
}
