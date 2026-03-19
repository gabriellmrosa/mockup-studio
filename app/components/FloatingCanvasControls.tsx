import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CameraIcon,
  RotateCcwIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./Icons";

type FloatingCanvasControlsProps = {
  onFitToScene: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function FloatingCanvasControls({
  onFitToScene,
  onZoomIn,
  onZoomOut,
}: FloatingCanvasControlsProps) {
  return (
    <div className="canvas-floating-toolbar">
      <div className="canvas-floating-cluster">
        <button
          type="button"
          className="canvas-fab"
          aria-label="Reset camera"
          title="Reset camera"
          onClick={onFitToScene}
        >
          <RotateCcwIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="canvas-fab"
          aria-label="Move up"
          title="Move up"
        >
          <ArrowUpIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="canvas-fab"
          aria-label="Move down"
          title="Move down"
        >
          <ArrowDownIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="canvas-fab"
          aria-label="Move left"
          title="Move left"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="canvas-fab"
          aria-label="Move right"
          title="Move right"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="canvas-fab"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={onZoomOut}
        >
          <ZoomOutIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="canvas-fab"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={onZoomIn}
        >
          <ZoomInIcon className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        className="canvas-capture-button"
        aria-label="Take photo"
        title="Take photo"
      >
        <CameraIcon className="h-4 w-4" />
        <span>Take photo</span>
      </button>
    </div>
  );
}
