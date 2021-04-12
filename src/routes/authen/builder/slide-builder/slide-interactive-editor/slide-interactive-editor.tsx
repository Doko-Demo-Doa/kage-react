import { useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { MediaType, MinimumCanvasSize } from "~/common/static-data";

import { emitter } from "~/services/events-helper";
import { canvasHelper } from "~/routes/authen/builder/slide-builder/slide-interactive-editor/canvas-helper";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor/slide-interactive-editor.scss";
import { fileUtils } from "~/utils/utils-files";

export const SlideInteractiveEditor: React.FC = () => {
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    emitter.on("insert-image", imgUrl => {
      const layer = layerRef.current;
      if (layer) {
        const mediaType = fileUtils.detectMediaType(imgUrl);
        if (mediaType === MediaType.IMAGE) {
          canvasHelper.insertImageCanvas(layer, imgUrl);
        } else if (mediaType === MediaType.VIDEO) {
          console.log("Go here");
          canvasHelper.insertVideoCanvas(layer, imgUrl);
        }
      }
    });
    return () => {
      emitter.off("insert-image", () => null);
    };
  }, []);

  return (
    <div id="slide-interactive-editor">
      <Stage style={{ background: "azure" }} width={MinimumCanvasSize.WIDTH} height={MinimumCanvasSize.HEIGHT}>
        <Layer ref={layerRef} />
      </Stage>
    </div>
  );
};
