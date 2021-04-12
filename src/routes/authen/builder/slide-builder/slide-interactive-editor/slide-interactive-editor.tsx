import { Stage, Layer, Rect } from "react-konva";
import { MinimumCanvasSize } from "~/common/static-data";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor/slide-interactive-editor.scss";

export const SlideInteractiveEditor: React.FC = () => {
  return (
    <div id="slide-interactive-editor">
      <Stage style={{ background: "azure" }} width={MinimumCanvasSize.WIDTH} height={MinimumCanvasSize.HEIGHT}>
        <Layer>
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            draggable
            shadowBlur={10}
          />
        </Layer>
      </Stage>
    </div>
  );
};
