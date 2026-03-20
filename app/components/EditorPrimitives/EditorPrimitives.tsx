import "./EditorPrimitives.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PanelHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
  titleClassName?: string;
};

export function PanelHeader({
  action,
  eyebrow,
  subtitle,
  title,
  titleClassName,
}: PanelHeaderProps) {
  return (
    <header className="panel-header">
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className="panel-eyebrow">{eyebrow}</p> : null}
        <div className="mt-1 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className={titleClassName ?? "panel-title"}>{title}</h2>
            {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
    </header>
  );
}

type PanelSectionProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
};

export function PanelSection({
  action,
  children,
  className,
  title,
}: PanelSectionProps) {
  return (
    <section className={`panel-section ${className ?? ""}`.trim()}>
      <div className="panel-section-header">
        <p className="editor-sidebar-label">{title}</p>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

export function IconButton({
  active = false,
  children,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`editor-icon-button ${active ? "editor-icon-button-active" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
