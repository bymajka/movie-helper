"use client";

import * as React from "react";
import { useState } from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/shared/utils";

const toggleVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-colors aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap border p-2 data-[state=on]:bg-toggle-active-background data-[state=off]:bg-toggle-background text-primary",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ToggleProps
  extends
    React.ComponentProps<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  withCloseIcon?: boolean;
  isActive?: boolean;
  onPressChange?: () => void;
}

function Toggle({
  className,
  variant,
  size,
  children,
  withCloseIcon = false,
  isActive: externalIsActive,
  onPressChange,
  pressed,
  onPressedChange,
  ...props
}: ToggleProps) {
  const [internalIsActive, setInternalIsActive] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isActive =
    externalIsActive !== undefined
      ? externalIsActive
      : pressed !== undefined
        ? pressed
        : internalIsActive;

  const handlePressedChange = (newPressed: boolean) => {
    if (externalIsActive === undefined && pressed === undefined) {
      setInternalIsActive(newPressed);
    }
    onPressedChange?.(newPressed);
    onPressChange?.();
  };

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      pressed={isActive}
      onPressedChange={handlePressedChange}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {isActive && withCloseIcon && <X className="w-4 h-4" />}
    </TogglePrimitive.Root>
  );
}

export { Toggle, toggleVariants };
