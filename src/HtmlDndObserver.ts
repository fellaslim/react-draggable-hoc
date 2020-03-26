import { DndObserver } from "./IDndObserver";
import {
  isTouchEvent,
  getPointer,
  DndEventListener,
  DndEvent,
  isDragEvent,
  isDragStart,
  attach,
  detach,
  getSelection,
  clearSelection,
  isMouseEvent,
} from "./HtmlHelpers";

export function dragPayloadFactory(event: MouseEvent | TouchEvent) {
  const { pageX, pageY } = isTouchEvent(event)
    ? getPointer(event as TouchEvent)
    : (event as MouseEvent);
  return {
    x: pageX,
    y: pageY,
    event,
  };
}

class HtmlDndObserver<T> extends DndObserver<T, DndEvent, HTMLElement> {
  constructor({ historyLength = 2 } = {}) {
    super();
    this.historyLength = historyLength;
  }
  private historyLength: number;
  private dragListener: DndEventListener | undefined = undefined;
  private dropListener: DndEventListener | undefined = undefined;
  private canceListener: ((...args: any) => void) | undefined = undefined;
  private initialized = false;
  private t: number | undefined = undefined;
  private delayed: DndEvent | undefined = undefined;
  private st: number | undefined = undefined;
  private selection: string = "";

  cleanup = () => {
    super.cleanup();
    if (this.t != null) {
      clearTimeout(this.t);
      this.t = undefined;
    }
    this.selection = "";
    this.clearSelectionMonitor();
    this.dragListener = undefined;
    this.dropListener = undefined;
    this.canceListener = undefined;
    this.delayed = undefined;
  };

  cancel = async (...args: any[]) => {
    let notificationNeeded = this.t != null || this.dragged != null;
    const { canceListener } = this;
    this.cleanup();
    if (typeof canceListener === "function") {
      canceListener(...args);
    }
    if (notificationNeeded) {
      await this.subs.notify("cancel", this.state);
    }
  };

  private clearSelectionMonitor = () => {
    if (this.st != null) {
      clearInterval(this.st);
      this.st = undefined;
    }
  };

  private checkSelection = () => {
    const selection = getSelection();
    const result = this.selection !== selection;
    this.selection = selection;
    return result;
  };

  private monitorSelection = () => {
    this.clearSelectionMonitor();
    this.selection = getSelection();
    this.st = window.setInterval(() => {
      if (this.checkSelection()) {
        this.clearSelectionMonitor();
        this.cancel("selection monitor");
      }
    }, 10);
  };

  private onDragListener = async (e: DndEvent) => {
    this.clearSelectionMonitor();

    if (this.delayed != null) {
      let shouldCancel = true;
      // add a simple threshold for touchpads/trackpads
      if (isMouseEvent(e)) {
        const p = dragPayloadFactory(e);
        const n = dragPayloadFactory(this.delayed);
        shouldCancel = Math.max(Math.abs(p.x - n.x), Math.abs(p.y - n.y)) > 2;
      }
      if (shouldCancel) this.cancel(e, "delayed drag timeout");
      return;
    }

    if (this.dragged != null) {
      if (!isDragEvent(e) || this.checkSelection()) {
        // cancel drag on second touch
        this.cancel(e);
      } else {
        // prevent scrolling on touch devices
        e.preventDefault();
        this.wasDetached = true;
        if (typeof this.dragListener === "function") {
          this.dragListener(e);
        }
      }
    }
  };

  private onDropListener = async (e: DndEvent) => {
    if (this.t != null) {
      this.cancel(e);
      return;
    }

    if (this.dragged != null && typeof this.dropListener === "function") {
      this.dropListener(e);
    }
  };

  makeDraggable: DndObserver<T, DndEvent, HTMLElement>["makeDraggable"] = (
    node,
    config = {},
  ) => {
    this.init();
    // prevent from text selection on drag
    try {
      node.style.userSelect = "none";
      node.style.webkitUserSelect = "none";
      node.style.msUserSelect = "none";
      (node.style as any).MozUserSelect = "none";
    } catch (e) {}

    const defaultDragListener = async (e: DndEvent) => {
      this.history.splice(
        this.historyLength > 1 ? this.historyLength : 1,
        this.history.length,
        dragPayloadFactory(e),
      );
      if (typeof config.onDrag === "function") {
        config.onDrag(this.state);
      }
      await this.subs.notify("drag", this.state);
    };

    const defaultDropListener = async (e: DndEvent) => {
      this.history.splice(
        this.historyLength > 1 ? this.historyLength : 1,
        this.history.length,
        dragPayloadFactory(e),
      );
      if (typeof config.onDrop === "function") {
        config.onDrop(this.state);
      }

      await this.subs.notify("drop", this.state);
      this.cleanup();
    };

    const defaultDragStartListener = async (e: DndEvent) => {
      if (this.dragged == null) {
        this.delayed = undefined;

        if (!config.delay) {
          clearSelection();
          this.selection = getSelection();
        }

        if (isDragStart(e) && !this.checkSelection()) {
          if (isMouseEvent(e)) {
            // prevent Safari/ desktop from scrolling during mousemove
            // if touchstart is prevented, click won't be fired
            e.preventDefault();
          }
          this.cleanup();
          this.dragListener = defaultDragListener;
          this.dropListener = defaultDropListener;
          this.canceListener = config.onDragCancel;

          this.history = [dragPayloadFactory(e)];
          this.dragProps = config.dragProps;
          this.dragged = node;

          if (typeof config.onDragStart === "function") {
            config.onDragStart(this.state);
          }

          await this.subs.notify("dragStart", this.state);
          this.monitorSelection();
        }
      }
    };

    const delayedDragListener = async (e: DndEvent) => {
      if (this.delayed == null && this.dragged == null) {
        if (isDragStart(e)) {
          if (isMouseEvent(e)) {
            // prevent Safari/ desktop from scrolling during mousemove
            // if touchstart is prevented, click won't be fired
            e.preventDefault();
          }

          // deal with text selection
          clearSelection();
          this.selection = getSelection();

          this.canceListener = config.onDragCancel;
          this.delayed = e;

          this.t = window.setTimeout(() => {
            this.t = undefined;
            if (this.checkSelection()) {
              this.cancel(e);
            } else {
              defaultDragStartListener(e);
            }
          }, config.delay);

          if (typeof config.onDelayedDrag === "function") {
            config.onDelayedDrag(this.state);
          }

          await this.subs.notify("delayedDrag", this.state);
        }
      }
    };

    if (node === this.dragged) {
      this.dragListener = defaultDragListener;
      this.dropListener = defaultDropListener;
      this.canceListener = config.onDragCancel;
    }

    const listener =
      config != null && config.delay != null && config.delay > 0
        ? delayedDragListener
        : defaultDragStartListener;

    attach("dragStart", listener, node, { passive: false, capture: false });

    return () => {
      detach("dragStart", listener, node, { capture: false });
      if (node === this.dragged) {
        this.dragListener = undefined;
        this.dropListener = undefined;
      }
    };
  };

  init = () => {
    if (!this.initialized) {
      attach("drag", this.onDragListener, window, { passive: false });
      attach("drop", this.onDropListener, window, { passive: false });
      window.addEventListener("scroll", this.cancel as any, { passive: true });
      window.addEventListener("contextmenu", this.cancel, { passive: true });
      window.addEventListener("touchcancel", this.cancel, { passive: true });
      this.initialized = true;
    }
  };

  destroy = () => {
    this.cleanup();
    if (this.initialized) {
      detach("drag", this.onDragListener);
      detach("drop", this.onDropListener);
      window.removeEventListener("scroll", this.cancel as any);
      window.removeEventListener("contextmenu", this.cancel);
      window.removeEventListener("touchcancel", this.cancel);
      this.initialized = false;
    }
  };
}

export default HtmlDndObserver;
