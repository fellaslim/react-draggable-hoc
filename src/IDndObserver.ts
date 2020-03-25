import PubSub from "./PubSub";

export type DnDPhases =
  | "dragStart"
  | "drag"
  | "cancel"
  | "drop"
  | "delayedDrag";

export interface ISharedState<T, E, N> {
  readonly initial?: { x: number; y: number; event: E };
  readonly current?: { x: number; y: number; event: E };
  readonly history: { x: number; y: number; event: E }[];
  readonly deltaX: number;
  readonly deltaY: number;
  cancel: () => void;
  dragProps?: T;
  node?: N;
  wasDetached: Boolean;
}

export interface IDndObserver<T, E, N> {
  makeDraggable(
    node: N,
    config?: {
      delay?: number;
      dragProps?: T;
      onDragStart?: (state: ISharedState<T, E, N>) => void;
      onDelayedDrag?: (state: ISharedState<T, E, N>) => void;
      onDrop?: (state: ISharedState<T, E, N>) => void;
      onDrag?: (state: ISharedState<T, E, N>) => void;
      onDragCancel?: (state: ISharedState<T, E, N>) => void;
    },
  ): () => void;
  init(): void;
  destroy(): void;
  cancel(): void;

  dragProps?: T;
  dragged?: N;
  wasDetached: Boolean;
  history: ISharedState<T, E, N>["history"];

  cleanup(): any;
  on: PubSub<DnDPhases, (state: ISharedState<T, E, N>) => void>["on"];
  off: PubSub<DnDPhases, (state: ISharedState<T, E, N>) => void>["off"];

  readonly state: ISharedState<T, E, N>;
}

// Typescript ABC sucks section
export interface DndObserver<T, E, N> extends IDndObserver<T, E, N> {}

export abstract class DndObserver<T, E, N> {
  // protected
  protected subs = new PubSub<
    DnDPhases,
    (state: ISharedState<T, E, N>) => void
  >();

  // additionals
  public dragProps?: T = undefined;
  public dragged?: N = undefined;
  public wasDetached: Boolean = false;
  public history: ISharedState<T, E, N>["history"] = [];

  public cleanup() {
    this.dragged = undefined;
    this.dragProps = undefined;
    this.wasDetached = false;
  }
  public on = this.subs.on;
  public off = this.subs.off;

  // calculated
  public get state() {
    const self = this;
    return {
      get history() {
        return self.history.slice();
      },
      get initial() {
        return this.history.length ? this.history[0] : undefined;
      },
      get current() {
        return this.history.length
          ? this.history[this.history.length - 1]
          : undefined;
      },
      get deltaX() {
        return this.history.length < 2 ? 0 : this.current!.x - this.initial!.x;
      },
      get deltaY() {
        return this.history.length < 2 ? 0 : this.current!.y - this.initial!.y;
      },
      get node() {
        return self.dragged;
      },
      get wasDetached() {
        return self.wasDetached;
      },
      get dragProps() {
        return self.dragProps;
      },
      // set wasDetached(value) {
      //   self.wasDetached = value;
      // },
      // set node(value) {
      //   self.dragged = value;
      // },
      // set dragProps(value) {
      //   self.dragProps = value;
      // },
      cancel: self.cancel,
    };
  }
}
