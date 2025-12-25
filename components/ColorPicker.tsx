"use client";

import { ENTRY_COLORS } from "@/lib/types";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({
  selectedColor,
  onColorChange,
}: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {ENTRY_COLORS.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorChange(color.name)}
          className={`h-8 w-8 rounded-full transition-transform ${color.dot} ${
            selectedColor === color.name
              ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110"
              : "hover:scale-105"
          }`}
          title={color.label}
          aria-label={`${color.label} color`}
        />
      ))}
    </div>
  );
}
