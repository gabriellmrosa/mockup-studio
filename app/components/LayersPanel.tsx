"use client";

import type { AppCopy, Locale, UiTheme } from "../lib/i18n";
import type { SceneObject } from "../lib/scene-objects";
import { DEVICE_MODELS } from "../models/device-models";

type LayersPanelProps = {
  copy: AppCopy;
  locale: Locale;
  objects: SceneObject[];
  onAddObject: () => void;
  onLocaleChange: (locale: Locale) => void;
  onRemoveObject: (id: string) => void;
  onSelectObject: (id: string) => void;
  onUiThemeChange: (theme: UiTheme) => void;
  selectedObjectId: string;
  uiTheme: UiTheme;
};

export default function LayersPanel({
  copy,
  locale,
  objects,
  onAddObject,
  onLocaleChange,
  onRemoveObject,
  onSelectObject,
  onUiThemeChange,
  selectedObjectId,
  uiTheme,
}: LayersPanelProps) {
  return (
    <aside className="editor-sidebar layers-sidebar w-[280px] h-screen flex flex-col shrink-0">
      <div className="px-5 py-4 border-b border-[var(--sidebar-border)]">
        <h1 className="text-sm font-semibold tracking-[0.22em] uppercase">
          {copy.appTitle}
        </h1>
        <p className="editor-sidebar-muted text-xs mt-1">{copy.appSubtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-center justify-between mb-3">
          <p className="editor-sidebar-label">{copy.layersSectionTitle}</p>
          <button className="editor-button px-3 py-2 text-xs" onClick={onAddObject}>
            {copy.addObject}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {objects.map((object) => {
            const model = DEVICE_MODELS[object.modelId];
            const isSelected = object.id === selectedObjectId;

            return (
              <button
                key={object.id}
                onClick={() => onSelectObject(object.id)}
                className={`layer-card ${isSelected ? "layer-card-active" : "layer-card-inactive"}`}
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{object.name}</p>
                    {!object.deletable ? (
                      <span className="layer-badge">{copy.baseObject}</span>
                    ) : null}
                  </div>
                  <p className="text-[11px] mt-1 opacity-70 truncate">
                    {model.name}
                  </p>
                </div>
                {object.deletable ? (
                  <span
                    className="layer-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveObject(object.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRemoveObject(object.id);
                      }
                    }}
                  >
                    {copy.deleteObject}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[var(--sidebar-border)] space-y-4">
        <div>
          <p className="editor-sidebar-label mb-3">{copy.themeLabel}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUiThemeChange("dark")}
              className={`editor-toggle ${uiTheme === "dark" ? "editor-toggle-active" : "editor-toggle-inactive"}`}
            >
              {copy.darkMode}
            </button>
            <button
              onClick={() => onUiThemeChange("light")}
              className={`editor-toggle ${uiTheme === "light" ? "editor-toggle-active" : "editor-toggle-inactive"}`}
            >
              {copy.lightMode}
            </button>
          </div>
        </div>

        <div>
          <p className="editor-sidebar-label mb-3">{copy.languageLabel}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLocaleChange("pt-BR")}
              className={`editor-toggle ${locale === "pt-BR" ? "editor-toggle-active" : "editor-toggle-inactive"}`}
            >
              {copy.portuguese}
            </button>
            <button
              onClick={() => onLocaleChange("en-US")}
              className={`editor-toggle ${locale === "en-US" ? "editor-toggle-active" : "editor-toggle-inactive"}`}
            >
              {copy.english}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
