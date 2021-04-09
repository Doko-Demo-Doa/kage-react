import { Stage, Layer, Star, Rect } from "react-konva";

import "./slide-interactive-editor.scss";

export const SlideInteractiveEditor: React.FC = () => {
  const getParentSize = () => {
    const parent = document.getElementById("slide-interactive-editor");
    const PADDED_SIZE = 20;

    return {
      width: (parent?.clientWidth || 0) - PADDED_SIZE,
      height: (parent?.clientHeight || 0) - PADDED_SIZE
    };
  };

  return (
    <div id="slide-interactive-editor">
      <Stage width={getParentSize().width} height={getParentSize().height}>
        <Layer>
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
          />
        </Layer>
      </Stage>
    </div>
  );
};
