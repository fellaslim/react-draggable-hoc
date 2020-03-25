import * as React from "react";

import {
  DragDropContainer,
  Draggable,
  Droppable,
  defaultPostProcessor,
  useDragStopPropagation,
} from "react-draggable-hoc";

const randomColor = () => {
  const randomPart = () => Math.floor(Math.random() * 255);
  return "rgb(" + randomPart() + "," + randomPart() + "," + randomPart() + ")";
};

// use a separate component to create a ghost
const ContentElement = ({ className = "", style, handleRef, value }: any) => {
  const ref = React.useRef(null);
  useDragStopPropagation(ref, "dragStart");
  return (
    <span style={style} className={`Cell ${className}`} ref={handleRef}>
      <div className="handle">
        <div className="bar" style={{ backgroundColor: style.color }} />
        <div className="bar" style={{ backgroundColor: style.color }} />
        <div className="bar" style={{ backgroundColor: style.color }} />
      </div>
      <span ref={ref}>{value}</span>
    </span>
  );
};

interface IContentProps {
  value: string;
  backgroundColor: string;
}

// stick to line
const postProcess = (props: any, ref: React.RefObject<any>) => {
  return {
    ...defaultPostProcessor(props, ref),
    deltaY: ref && ref.current ? ref.current.clientHeight : 0,
  };
};

const Content = ({ backgroundColor, value }: IContentProps) => {
  const [color, changeColor] = React.useState<string>();

  return (
    <Draggable
      delay={100}
      dragProps={backgroundColor}
      postProcess={postProcess}
      onDragStart={() => {
        document.body.style.cursor = "ew-resize";
      }}
      onDragEnd={() => {
        document.body.style.cursor = "initial";
      }}
    >
      {({ handleRef, isDetached }) =>
        handleRef != null ? (
          <Droppable
            onDrop={({ dragProps }) => {
              if (dragProps !== backgroundColor) {
                changeColor(dragProps as string);
              }
            }}
            method={(state, nodeRef, defaultMethod) => {
              const a = nodeRef.current.getBoundingClientRect();
              const { x } = state.current!;

              return a.left <= x && a.right >= x;
            }}
          >
            {({ isHovered, dragProps, ref }) => (
              <div
                style={{
                  display: "inline-block",
                  textAlign: "left",
                  position: "relative",
                }}
                ref={ref}
              >
                {/* change text color when element is dragged */}
                <ContentElement
                  value={
                    dragProps
                      ? dragProps === backgroundColor
                        ? isHovered
                          ? "Not here"
                          : "I'm dragged"
                        : isHovered
                        ? "Drop here"
                        : "Hover me"
                      : value
                  }
                  style={{
                    backgroundColor,
                    color: isDetached ? "#fff" : color,
                    width: "100px",
                  }}
                  className={
                    isHovered && dragProps !== backgroundColor
                      ? "hovered"
                      : undefined
                  }
                  handleRef={handleRef}
                />
              </div>
            )}
          </Droppable>
        ) : (
          <ContentElement
            value={value}
            style={{
              backgroundColor,
              color,
              width: "100px",
            }}
          />
        )
      }
    </Draggable>
  );
};

export const GhostExample = () => (
  <DragDropContainer className="Ghost-container">
    {({ ref }) => (
      <div className="Ghost-container" ref={ref}>
        {Array(60)
          .fill(0)
          .map((_, i) => {
            const color = randomColor();
            return (
              <Content backgroundColor={color} value={`Drag me`} key={i} />
            );
          })}
      </div>
    )}
  </DragDropContainer>
);

export const GhostExampleTitle = () => (
  <p>
    Scrollable container, <br />
    draggable and droppable elements <br />
    with a ghost stuck to row bottom <br />
    custom hover implementation <br />
    drag handle <br />
    and a delay of 100ms <br />
    ew-resize cursor on drag
  </p>
);

export default () => (
  <React.Fragment>
    <GhostExampleTitle />
    <GhostExample />
  </React.Fragment>
);
