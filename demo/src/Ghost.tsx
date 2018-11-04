import * as React from 'react';
import { findDOMNode } from 'react-dom';
import {
  draggable,
  draggableContainer,
  DraggableMonitor,
  Droppable,
  IDraggableProps,
  IDroppableProps,
} from 'react-draggable-hoc';

const randomColor = () => {
  const randomPart = () => Math.floor(Math.random()*255);
  return 'rgb('+randomPart()+','+randomPart()+','+randomPart()+')';
}
  
// use a separate component to create a ghost
const ContentElement = ({ className="", value, style } : any) => (
  <span
    style={style}
    className={`Cell ${className}`}
  >
    {value}
  </span>
)
  
interface IContentProps {
  value: string,
  backgroundColor: string
}
  
const Content = draggable(
  class ContentWrapper extends React.Component<IDraggableProps & IContentProps> {
    public state = {
      color: undefined,
      isHovered: false
    }

    public onDrop = ({dragProps}: IDroppableProps) => {
      const state = {isHovered: false} as any;
      if (!this.props.isDragged && this.state.isHovered) {
        state.color = dragProps;
      }
      this.setState(state);
    }

    public onDrag = ({isHovered} : IDroppableProps) => {
      if (this.state.isHovered !== isHovered) {
        this.setState({isHovered});
      }
    }

    public isHovered = (component: React.Component<any>, { props: { x, initialEvent } }: DraggableMonitor) => {
      const nodeRect = (findDOMNode(component) as HTMLElement).getBoundingClientRect();
      return initialEvent != null && nodeRect.left <= initialEvent.pageX + x && nodeRect.right >= initialEvent.pageX + x;
    }

    public render() {
      const { x, isDragged, backgroundColor, value} = this.props;
      const { color, isHovered } = this.state;

      return (
        <Droppable
          onDrag={this.onDrag}
          onDrop={this.onDrop}
          isHovered={this.isHovered}
        >
          <div style={{display: 'inline-block', textAlign: 'left', position: 'relative'}}>
            {/* create a ghost and position it on drag */}
            {isDragged && (
              <ContentElement
                value={value}
                style={{
                  backgroundColor,
                  color,
                  position: 'absolute',
                  transform: `translate3d(${x}px, 100%, -1px)`,
                  zIndex: 1,
                }}
              />
            )}
            {/* change text color when element is dragged */}
            <ContentElement
              value={value}
              style={{
                backgroundColor, color: isDragged ? 'red' : color
              }}
              className={isHovered ? 'hovered' : undefined}
            />
          </div>
        </Droppable>
      )
    }
  }
)


export const GhostExample = draggableContainer(() => (
  <div className="Ghost-container">
    {Array(20).fill(0).map((_, i) => {
      const color = randomColor();
      return (
        <Content
          backgroundColor={color}
          value={`Hello ${i}`}
          key={i}
          dragProps={color}
        />
      )
    })}
  </div>
))

export const GhostExampleTitle = () => (
  <p>
    Scrollable container, <br />
    draggable and droppable elements <br />
    with a ghost stuck to row bottom <br />
    and effects on drag over and drag start
  </p>
)
