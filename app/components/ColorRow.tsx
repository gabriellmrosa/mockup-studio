"use client";

import { ChangeEvent, useState } from "react";

type ColorRowProps = {
  compact?: boolean;
  label: string;
  onChange: (hex: string) => void;
  uiTheme: "dark" | "light";
  value: string;
};

export default function ColorRow({
  compact = false,
  label,
  onChange,
  uiTheme,
  value,
}: ColorRowProps) {
  const [inputVal, setInputVal] = useState(value);

  const handleHexInput = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInputVal(nextValue);

    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(nextValue)) {
      onChange(nextValue);
    }
  };

  const handleColorPicker = (event: ChangeEvent<HTMLInputElement>) => {
    setInputVal(event.target.value);
    onChange(event.target.value);
  };

  if (inputVal !== value && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
    setInputVal(value);
  }

  return (
    <div className={`flex items-center gap-3 ${compact ? "justify-end" : ""}`}>
      {label ? (
        <span className="flex-1 truncate text-[0.625rem] uppercase tracking-[0.16em] text-[var(--sidebar-muted)]">
          {label}
        </span>
      ) : null}
      <label
        className={`relative shrink-0 cursor-pointer overflow-hidden border border-[var(--input-border)] transition hover:border-[var(--input-border-hover)] ${
          compact ? "h-7 w-7 rounded-[0.625rem]" : "h-8 w-8 rounded-full"
        }`}
      >
        <input
          type="color"
          value={value}
          onChange={handleColorPicker}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-full h-full" style={{ backgroundColor: value }} />
      </label>
      <input
        type="text"
        value={inputVal}
        onChange={handleHexInput}
        maxLength={7}
        placeholder="#000000"
        className={`editor-input ${compact ? "w-[5.5rem] px-2 py-1.5" : "w-24 px-2.5 py-2"} rounded-[0.625rem] text-[0.6875rem] font-mono transition focus:outline-none ${uiTheme === "dark" ? "selection:bg-white/20" : "selection:bg-black/10"}`}
      />
    </div>
  );
}
