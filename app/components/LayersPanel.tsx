"use client";

import { KeyboardEvent, useState } from "react";
import type { AppCopy, Locale, UiTheme } from "../lib/i18n";
import type { SceneObject } from "../lib/scene-objects";
import { DEVICE_MODELS } from "../models/device-models";
import { IconButton, PanelHeader, PanelSection } from "./EditorPrimitives";
import { MoreVerticalIcon, PlusIcon } from "./Icons";
import ToggleSwitch from "./toggleSwitch";

type LayersPanelProps = {
  copy: AppCopy;
  locale: Locale;
  objects: SceneObject[];
  onAddObject: () => void;
  onLocaleChange: (locale: Locale) => void;
  onRenameObject: (id: string, name: string) => void;
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
  onRenameObject,
  onRemoveObject,
  onSelectObject,
  onUiThemeChange,
  selectedObjectId,
  uiTheme,
}: LayersPanelProps) {
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  function startEditing(object: SceneObject) {
    setEditingObjectId(object.id);
    setDraftName(object.name);
  }

  function commitEditing(object: SceneObject) {
    const normalizedName = draftName.trim();

    onRenameObject(object.id, normalizedName || object.name);
    setEditingObjectId(null);
    setDraftName("");
  }

  function cancelEditing() {
    setEditingObjectId(null);
    setDraftName("");
  }

  function handleNameInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    object: SceneObject,
  ) {
    if (event.key === "Enter") {
      commitEditing(object);
      return;
    }

    if (event.key === "Escape") {
      cancelEditing();
    }
  }

  return (
    <aside className="editor-sidebar layers-sidebar h-screen w-[19rem] shrink-0">
      <div className="flex h-full flex-col">
        <div className="relative">
          <PanelHeader
            title={copy.appTitle}
            subtitle="Version 1.0"
            titleClassName="panel-title panel-title-brand"
            action={
              <IconButton
                aria-expanded={isPreferencesOpen}
                aria-label="Open preferences"
                title="Open preferences"
                active={isPreferencesOpen}
                onClick={() => setIsPreferencesOpen((current) => !current)}
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </IconButton>
            }
          />

          {isPreferencesOpen ? (
            <div className="floating-menu">
              <div className="floating-menu-block">
                <p className="floating-menu-label">{copy.themeLabel}</p>
                <ToggleSwitch
                  ariaLabel={copy.themeLabel}
                  value={uiTheme}
                  onChange={onUiThemeChange}
                  options={[
                    {
                      value: "dark",
                      label: copy.darkMode,
                      iconAlt: copy.darkMode,
                      iconSrc: "/icons/moon-and-stars.png",
                    },
                    {
                      value: "light",
                      label: copy.lightMode,
                      iconAlt: copy.lightMode,
                      iconSrc: "/icons/sun.png",
                    },
                  ]}
                />
              </div>

              <div className="floating-menu-block">
                <p className="floating-menu-label">{copy.languageLabel}</p>
                <ToggleSwitch
                  ariaLabel={copy.languageLabel}
                  value={locale}
                  onChange={onLocaleChange}
                  options={[
                    {
                      value: "pt-BR",
                      label: copy.portuguese,
                      iconAlt: copy.portuguese,
                      iconClassName: "toggle-switch-icon-flag",
                      iconSrc: "/icons/brazil-flag.png",
                    },
                    {
                      value: "en-US",
                      label: copy.english,
                      iconAlt: copy.english,
                      iconClassName: "toggle-switch-icon-flag",
                      iconSrc: "/icons/eua-flag.png",
                    },
                  ]}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto">
          <PanelSection
            title="3D Objects"
            action={
              <button
                className="editor-section-action"
                onClick={onAddObject}
                aria-label={copy.addObject}
                title={copy.addObject}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            }
          >
            <div className="flex flex-col gap-2">
          {objects.map((object) => {
            const model = DEVICE_MODELS[object.modelId];
            const isSelected = object.id === selectedObjectId;

            return (
              <div
                key={object.id}
                onClick={() => onSelectObject(object.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectObject(object.id);
                  }
                }}
                className={`layer-card ${isSelected ? "layer-card-active" : "layer-card-inactive"}`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    {editingObjectId === object.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={draftName}
                        onBlur={() => commitEditing(object)}
                        onChange={(event) => setDraftName(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        onDoubleClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => handleNameInputKeyDown(event, object)}
                        className="editor-input layer-card-name-input"
                      />
                    ) : (
                      <p
                        className="layer-card-title"
                        onDoubleClick={(event) => {
                          event.stopPropagation();
                          startEditing(object);
                        }}
                      >
                        {object.name}
                      </p>
                    )}
                    {!object.deletable ? (
                      <span className="layer-badge">{copy.baseObject}</span>
                    ) : null}
                  </div>
                  <p className="layer-card-subtitle">
                    {model.name}
                  </p>
                </div>
                <IconButton
                  className="layer-menu-trigger"
                  aria-label={copy.deleteObject}
                  title={copy.deleteObject}
                  onClick={(event) => {
                    event.stopPropagation();
                    void onRemoveObject;
                  }}
                >
                  <MoreVerticalIcon className="h-4 w-4" />
                </IconButton>
              </div>
            );
          })}
            </div>
          </PanelSection>
        </div>

        <footer className="sidebar-footer">
          <p>Made with love by Gabriel Rosa</p>
          <p>Credits for 3D assets</p>
        </footer>
      </div>
    </aside>
  );
}
