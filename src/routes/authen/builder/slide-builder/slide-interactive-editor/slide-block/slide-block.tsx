import React from "react";
import Konva from "konva";
import { Image, Text, Transformer } from "react-konva";
import useImage from "use-image";
import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

type SlideBlockComponentType = SlideBlockType & {
  selected?: boolean;
  onSelect: (id: string) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({
  onSelect,
  id,
  type,
  assetName,
}) => {
  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`;

  const [image] = useImage(`${assetUrl}` || "");
  const mainBlockRef = React.useRef<Konva.Image>(null);
  const trRef = React.useRef<Konva.Transformer>(null);

  React.useEffect(() => {
    trRef.current?.nodes(mainBlockRef.current ? [mainBlockRef.current] : []);
    trRef.current?.getLayer()?.batchDraw();
  });

  const getMainComponent = () => {
    if (type === MediaType.IMAGE) {
      return (
        <>
          <Image
            ref={mainBlockRef}
            onClick={() => onSelect(id)}
            image={image}
            draggable
            x={200}
            y={50}
            scaleX={0.3}
            scaleY={0.3}
          />
        </>
      );
    }

    return <Text text="Test" />;
  };

  return (
    <>
      {getMainComponent()}
      <Transformer
        ref={trRef}
        enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
        rotateEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
};
