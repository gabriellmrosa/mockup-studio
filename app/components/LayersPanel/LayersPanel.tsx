"use client";

import "./LayersPanel.css";
import { KeyboardEvent, useState } from "react";
import type { AppCopy, Locale, UiTheme } from "../../lib/i18n";
import type { SceneObject } from "../../lib/scene-objects";
import { DEVICE_MODELS } from "../../models/device-models";
import { IconButton, PanelHeader, PanelSection } from "../EditorPrimitives/EditorPrimitives";
import { MoreVerticalIcon, PlusIcon } from "../Icons";
import ToggleSwitch from "../toggleSwitch/toggleSwitch";

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

        <div className="flex flex-col flex-1 overflow-y-auto">
          <PanelSection
            title="3D Objects"
            className="section-objects"
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
                            onChange={(event) =>
                              setDraftName(event.target.value)
                            }
                            onClick={(event) => event.stopPropagation()}
                            onDoubleClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) =>
                              handleNameInputKeyDown(event, object)
                            }
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
                      </div>
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
          <div className="flex items-center gap-1">
            <p>Made with </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="9"
              fill="none"
            >
              <path
                fill="var(--sidebar-muted)"
                stroke="var(--sidebar-muted)"
                strokeWidth=".264"
                d="m4.215 8.386-.018-.008-.013-.01-.024-.02-.032-.034-.111-.116-.39-.414A417 417 0 0 1 1.272 5.24l-.4-.44-.121-.133-.06-.07v-.001a2.9 2.9 0 0 1-.55-1.513L.133 2.85c.003-.47.129-.952.355-1.37l.122-.205A3.2 3.2 0 0 1 1.04.78l.15-.129A2.44 2.44 0 0 1 3.82.414h.001c.15.079.336.202.445.296l.066-.048c.182-.14.508-.32.707-.39.185-.064.39-.107.594-.127.189-.018.248-.017.446.001h.001c.614.06 1.177.35 1.608.828.312.347.519.741.635 1.21l.044.205c.02.11.029.306.029.492a3 3 0 0 1-.029.491v.001a3 3 0 0 1-.452 1.134c-.012.016-.037.045-.062.074l-.123.137-.409.45a371 371 0 0 1-2.406 2.603l-.397.423-.15.155-.014.012-.027.019c-.001 0-.027.015-.062.016a.2.2 0 0 1-.05-.01Zm1.532-2.44c.505-.543.906-.977 1.188-1.285l.33-.365.132-.153c.161-.23.29-.539.352-.858a2.4 2.4 0 0 0 .03-.388 2.4 2.4 0 0 0-.022-.385 2.4 2.4 0 0 0-.359-.892 2.1 2.1 0 0 0-.612-.574L6.688.99a2.1 2.1 0 0 0-.625-.198l-.12-.004q-.081 0-.183.005c-.133.007-.257.02-.312.032l-.13.035a2 2 0 0 0-.816.504l-.138.14-.09.094-.095-.09-.036-.035-.152-.149-.087-.082A1.85 1.85 0 0 0 2.032.904C1.097 1.27.563 2.35.818 3.408c.067.276.175.517.33.736l.002.004.008.01q.01.013.028.032l.094.109q.121.136.335.369c.284.31.685.745 1.18 1.278l1.476 1.588z"
              />
            </svg>{" "}
            <p>
              by{" "}
              <a
                href="will_be_added_later"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Gabriel Rosa
              </a>
            </p>
          </div>

          <p>
            <a
              href="will_be_added_later"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Credits
            </a>{" "}
            for 3D assets
          </p>
        </footer>
      </div>
    </aside>
  );
}
