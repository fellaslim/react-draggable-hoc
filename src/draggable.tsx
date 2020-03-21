import * as React from "react";
import * as ReactDOM from "react-dom";

import { DragContext } from "./dragDropContainer";
import useDraggableFactory from "./useDraggableFactory";
import useRect from "./useRect";

export function defaultPostProcessor(
  props: any, // FIXME
  ref: React.RefObject<HTMLDivElement>
) {
  if (ref && ref.current) {
    return {
      ...props,
      ...props.monitor.getDeltas(
        props.container.current,
        ref.current.getBoundingClientRect()
      )
    };
  }

  return props;
}

function Detached({
  children,
  parent
}: {
  children: React.ReactNode;
  parent: HTMLElement;
}) {
  return ReactDOM.createPortal(
    <React.Fragment>{children}</React.Fragment>,
    parent
  );
}

/**
 * Generates Draggable div for provided context.
 *
 * @param context DragContext
 */
function draggable(context: typeof DragContext) {
  const useDraggable = useDraggableFactory(context);

  return function Draggable({
    dragProps,
    className = "draggable",
    children,
    postProcess = defaultPostProcessor,
    detachDelta = 20,
    delay = 100,
    detachedParent = document.body,
    onDragStart,
    onDragEnd
  }: {
    dragProps: any; // drag props to be used
    className?: string;
    postProcess?: (props: any, ref: React.RefObject<HTMLDivElement>) => any; //FIXME
    detachDelta?: number;
    delay?: number;
    detachedParent?: HTMLElement;
    key?: any;
    onDragStart?: () => any;
    onDragEnd?: () => any;
    children?:
      | React.FunctionComponent<{
          handleRef?: React.RefObject<any>;
          isDetached: boolean;
          cancel?: () => void;
        }>
      | React.ReactNode;
  }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const handleRef = React.useRef();
    const props = useDraggable(
      typeof children === "function" ? handleRef : ref,
      {
        dragProps,
        delay
      }
    );
    const prevProps = React.useRef(props);

    const [, size, position] = useRect(ref, [props.delayed]);

    const { deltaX, deltaY, isDragged } = React.useMemo(
      () => postProcess(props, ref),
      [props, postProcess, ref]
    );

    const isDetached = React.useMemo(
      () =>
        isDragged && Math.max(...[deltaX, deltaY].map(Math.abs)) >= detachDelta,
      [deltaX, deltaY, detachDelta, isDragged]
    );

    React.useEffect(() => {
      if (prevProps.current.isDragged !== props.isDragged) {
        if (props.isDragged && typeof onDragStart === "function") {
          onDragStart();
        }

        if (!props.isDragged && typeof onDragEnd === "function") {
          onDragEnd();
        }
      }

      prevProps.current = props;
    }, [props, onDragStart, onDragEnd]);

    return (
      <div
        className={className + (isDragged && isDetached ? " dragged" : "")}
        ref={ref}
      >
        {isDragged && isDetached && detachedParent != null && (
          <Detached parent={detachedParent}>
            <div
              style={{
                transform: `translate3d(${deltaX}px, ${deltaY}px, 1px)`,
                position: "fixed",
                ...size,
                ...position
              }}
              id="dragged-node-clone"
            >
              {typeof children === "function"
                ? children({ isDetached })
                : children}
            </div>
          </Detached>
        )}
        {typeof children === "function"
          ? children({
              handleRef,
              isDetached
            })
          : children}
      </div>
    );
  };
}

export default draggable;
