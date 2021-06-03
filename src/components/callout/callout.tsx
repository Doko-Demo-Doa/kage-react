import React, { useState, useEffect, useRef } from "react";
import { DraggableEvent, DraggableEventHandler } from "react-draggable";
import { DraggableData, RndResizeStartCallback, RndResizeCallback, Rnd } from "react-rnd";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

type PositionType = "top" | "left" | "right" | "bottom";

type Props = {
  className?: string;
  backgroundColor: string;
  box: Box;
  pointer: Position;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  draggingDisabled?: boolean;
  resizingDisabled?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  strokeColor?: string;
  zIndex?: number;
  marker?: string | React.ReactElement;
  // Funcs
  onBoxDragStart?: () => void | undefined;
  onBoxDrag?: (data: { x: number; y: number }) => void | undefined;
  onBoxDragStop?: (e: DraggableEvent, d: DraggableData) => void | undefined;
  onBoxResizeStart?: RndResizeStartCallback;
  onBoxResize?: (data: { width: number; height: number }) => void | undefined;
  onBoxResizeStop?: RndResizeCallback;
  onPointerDragStart?: () => void | undefined;
  onPointerDrag?: (data: { x: number; y: number }) => void | undefined;
  onPointerDragStop?: (data: { x: number; y: number }) => void | undefined;
};

const OFFSET = 7;

export const Calllout: React.FC<Props> = ({
  children,
  style,
  box,
  pointer,
  maxHeight,
  maxWidth,
  className,
  zIndex,
  marker,
  draggingDisabled,
  resizingDisabled,
  onBoxDragStart,
  onBoxDrag,
  onBoxDragStop,
  onBoxResizeStart,
  onBoxResize,
  onBoxResizeStop,
  onPointerDragStart,
  onPointerDrag,
  onPointerDragStop,
}) => {
  const getDegree = (origin: Position, destination: Position) => {
    const x = destination.x - origin.x;
    const y = origin.y - destination.y;
    const rad = Math.atan2(y, x);
    if (isNaN(rad)) return 0;
    return (rad * 360) / (2 * Math.PI);
  };

  const getPointerType = (origin: Position, destination: Position): PositionType => {
    const degree = getDegree(origin, destination);
    if (degree >= -45 && degree < 45) return "right";
    if (degree >= 45 && degree < 135) return "top";
    if ((degree >= 135 && degree <= 180) || (degree >= -180 && degree < -135)) return "left";
    return "bottom";
  };

  const getBoxCenter = (b: Box) => {
    return {
      x: b.x + b.width / 2,
      y: b.y + b.height / 2,
    };
  };

  const calculatePointer = (destination: Position, b: Box, type: PositionType) => {
    let base: Position[];
    let control: Position;

    const { x, y, width, height } = b;

    switch (type) {
      case "top":
        base = [
          { x: x + width * 0.25, y: y + 1 },
          { x: x + width * 0.75, y: y + 1 },
        ];
        control = { x: x + width * 0.5, y };
        break;
      case "right":
        base = [
          { x: x + width - 1, y: y + height * 0.25 },
          { x: x + width - 1, y: y + height * 0.75 },
        ];
        control = { x: x + width, y: y + height * 0.5 };
        break;
      case "bottom":
        base = [
          { x: x + width * 0.25, y: y + height - 1 },
          { x: x + width * 0.75, y: y + height - 1 },
        ];
        control = { x: x + width * 0.5, y: y + height };
        break;
      case "left":
        base = [
          { x, y: y + height * 0.25 },
          { x, y: y + height * 0.75 },
        ];
        control = { x, y: y + height * 0.5 };
        break;
      default:
        base = [
          { x: x + width, y: y + height * 0.25 },
          { x: x + width, y: y + height * 0.75 },
        ];
        control = { x: x + width, y: y + height * 0.5 };
        break;
    }

    return {
      base,
      control,
      destination,
    };
  };

  const getPointer = (b: Box, destination: Position) => {
    const boxCenter = getBoxCenter(b);
    const type = getPointerType(boxCenter, destination);
    return calculatePointer(destination, b, type);
  };

  const [localPointer, setLocalPointer] = useState(getPointer(box, pointer));
  const [localBox, setLocalBox] = useState<Box>(box);
  const [localMaxHeight, setLocalMaxHeight] = useState(maxHeight);
  const [localMaxWidth, setLocalMaxWidth] = useState(maxWidth);

  const wrapper: React.LegacyRef<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const pointerState = getPointer(box, pointer);
    setLocalPointer(pointerState);
    setLocalBox(box);
  }, [box, pointer]);

  const _onDrag = (e: DraggableEvent, data: DraggableData) => {
    const { width, height } = localBox;
    const { destination } = localPointer;

    const { x, y } = data;
    const newBox = { x, y, width, height };
    const pointerState = getPointer(newBox, destination);
    setLocalBox(newBox);
    setLocalPointer(pointerState);

    onBoxDrag?.({ x, y });
  };

  const _onDragStop = (e: DraggableEvent, data: DraggableData) => {
    onBoxDragStop?.(e, data);
  };

  const _onResize: RndResizeCallback = (e: MouseEvent | TouchEvent, dir, elementRef, delta) => {
    const { x, y } = localBox;
    const { destination } = localPointer;
    const toBottomBoundary = wrapper.current?.clientHeight || 0 - y;
    const toRightBoundary = wrapper.current?.clientWidth || 0 - x;

    const newMaxHeight =
      toBottomBoundary < (maxHeight ?? 0) || !maxHeight ? toBottomBoundary : maxHeight;
    const newMaxWidth = toRightBoundary < (maxWidth ?? 0) || !maxWidth ? toRightBoundary : maxWidth;

    const newW = localBox.width + delta.width;
    const newH = localBox.height + delta.height;

    const newBox = { x, y, width: newW, height: newH };
    const pointerState = getPointer(newBox, destination);

    setLocalBox(newBox);
    setLocalPointer(pointerState);
    setLocalMaxHeight(newMaxHeight);
    setLocalMaxWidth(newMaxWidth);

    console.log(localMaxWidth, localMaxHeight);

    onBoxResize?.({ width: newW, height: newH });
  };

  const _onPointerDrag: DraggableEventHandler = (e, d) => {
    const destination = { x: d.x + OFFSET, y: d.y + OFFSET };
    const pointerState = getPointer(localBox, destination);
    setLocalPointer(pointerState);
    onPointerDrag?.({ x: d.x, y: d.y });
  };

  const _onPointerDragStop: DraggableEventHandler = (e, d) => {
    onPointerDragStop?.({ x: d.x, y: d.y });
  };

  const { base, control, destination } = localPointer;

  return (
    <div
      ref={wrapper}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        zIndex,
        position: "absolute",
        pointerEvents: "none",
      }}
    >
      <Rnd
        position={{
          x: box.x,
          y: box.y,
        }}
        size={{
          width: box.width,
          height: box.height,
        }}
        style={{
          ...style,
          backgroundColor: "grey",
          pointerEvents: "auto",
          position: "absolute",
          zIndex,
        }}
        disableDragging={draggingDisabled}
        enableResizing={
          resizingDisabled
            ? {
                top: false,
                right: false,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                topLeft: false,
                bottomLeft: false,
              }
            : {
                top: false,
                right: true,
                bottom: true,
                left: false,
                topRight: false,
                bottomRight: true,
                topLeft: false,
                bottomLeft: false,
              }
        }
        onDragStart={onBoxDragStart}
        onDrag={_onDrag}
        onDragStop={_onDragStop}
        onResizeStart={onBoxResizeStart}
        onResize={_onResize}
        onResizeStop={onBoxResizeStop}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        bounds="parent"
      >
        <div style={{ padding: "0px", width: "100%", height: "100%", pointerEvents: "none" }}>
          {children}
        </div>
      </Rnd>
      <Rnd
        x={pointer.x}
        y={pointer.y - OFFSET}
        style={{ pointerEvents: "auto", zIndex }}
        onDragStart={onPointerDragStart}
        onDrag={_onPointerDrag}
        onDragStop={_onPointerDragStop}
        bounds="parent"
        // Đây là ô vuông chỉnh hướng callout, chỉ drag
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          topLeft: false,
          bottomLeft: false,
        }}
      >
        {marker || (
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "white",
              border: "1px solid grey",
            }}
          />
        )}
      </Rnd>
      <svg width="100%" height="100%" style={{ zIndex, pointerEvents: "none" }}>
        <path
          d={`M ${base[0].x} ${base[0].y}
                 Q ${control.x} ${control.y} ${destination.x} ${destination.y}
                 Q ${control.x} ${control.y} ${base[1].x} ${base[1].y}`}
          fill={"grey"}
          stroke={"grey"}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};
