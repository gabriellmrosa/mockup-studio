export default function Control({
  label,
  uiTheme,
  value,
  setValue,
  min,
  max,
  step = 1,
}: {
  label: string;
  uiTheme: "dark" | "light";
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--sidebar-muted)]">
          {label}
        </span>
        <span className="text-xs font-mono text-[var(--sidebar-value)]">
          {value.toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className={uiTheme === "dark" ? "accent-white" : "accent-black"}
      />

      <input
        type="number"
        className="editor-input rounded-lg px-2 py-1.5 text-sm focus:outline-none"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}
