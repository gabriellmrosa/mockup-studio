type IconProps = {
  className?: string;
};

function iconProps(className?: string) {
  return {
    "aria-hidden": true,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
  };
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function MoreVerticalIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function RotateCcwIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 16V5" />
      <path d="m7 10 5-5 5 5" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function ZoomInIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8.5v5" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

export function ZoomOutIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="m12 5-5 5" />
      <path d="m12 5 5 5" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="m12 19-5-5" />
      <path d="m12 19 5-5" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="m5 12 5-5" />
      <path d="m5 12 5 5" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="m19 12-5-5" />
      <path d="m19 12-5 5" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 8h3l1.6-2h6.8L17 8h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}
