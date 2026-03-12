export default function Control({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-neutral-300">
        {label}: {value}
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />

      <input
        type="number"
        className="bg-neutral-800 px-2 py-1 rounded"
        value={value}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}
