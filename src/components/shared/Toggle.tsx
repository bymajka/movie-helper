'use client';

import { Toggle as ToggleUI } from "@/components/ui/toggle";
import { X } from "lucide-react";
import { useState } from "react";

interface ToggleProps {
    children: React.ReactNode;
    className?: string;
    withCloseIcon?: boolean;
    onPressChange?: () => void;
    isActive?: boolean;
}

export function Toggle({ children, className, withCloseIcon = false, onPressChange, isActive: externalIsActive }: ToggleProps) {
  const [internalIsActive, setInternalIsActive] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isActive = externalIsActive !== undefined ? externalIsActive : internalIsActive;

  return (
    <ToggleUI
      pressed={isActive}
      onPressedChange={() => {
        if (externalIsActive === undefined) {
          setInternalIsActive(!internalIsActive);
        }
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
