import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { AppDefaults, MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

type SlideBlockComponentType = SlideBlockType & {
  selected?: boolean;
  onSelect: (id: string) => void | undefined;
  onDrag?: (
    blockId: string,
    center: { x: number; y: number },
    size: { w: number; h: number }
  ) => void | undefined;
  onResized?: (
    blockId: string,
    topLeft: { x: number; y: number },
    size: { w: number; h: number }
  ) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({
  id,
  type,
  assetName,
  size,
  position,
  onDrag,
  onResized,
}) => {
  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`;

  let initW = AppDefaults.DEFAULT_IMAGE_SCALE * (size?.w ?? 0);
  let initH = AppDefaults.DEFAULT_IMAGE_SCALE * (size?.h ?? 0);

  let initX = 0;
  let initY = 0;

  if (size) {
    initW = size.w;
    initH = size.h;
  }

  if (position) {
    // Translate to top-left
    initX = position.x - initW / 2;
    initY = position.y - initH / 2;
  }

  const [blockW, setBlockW] = useState(initW);
  const [blockH, setBlockH] = useState(initH);

  const getMainComponent = () => {
    if (type === MediaType.IMAGE) {
      return (
        <Rnd
          bounds="parent"
          lockAspectRatio
          onDragStop={(e, d) => {
            const topLeftX = d.x;
            const topLeftY = d.y;
            if (!size) return;
            const centerOriginW = topLeftX + blockW / 2;
            const centerOriginH = topLeftY + blockH / 2;

            onDrag?.(id, { x: centerOriginW, y: centerOriginH }, { w: blockW, h: blockH });
          }}
          onResizeStop={(mouseEvent, direction, element, delta, position) => {
            const newW = blockW + delta.width;
            const newH = blockH + delta.height;

            setBlockW(newW);
            setBlockH(newH);

            const newX = position.x + newW / 2;
            const newY = position.y + newH / 2;

            onResized?.(id, { x: newX, y: newY }, { w: newW, h: newH });
          }}
          enableResizing={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          default={{
            x: initX,
            y: initY,
            width: size?.w ?? 0,
            height: size?.h ?? 0,
          }}
          position={{
            x: initX,
            y: initY,
          }}
          className="single-block"
          style={{
            backgroundImage: `url(${assetUrl})`,
          }}
        />
      );
    }

    if (type === MediaType.TABLE) {
      return (
        <Rnd
          onDragStop={(e, d) => {
            console.log(d);
            console.log(size);
          }}
          default={{
            x: 0,
            y: 0,
            width: 320,
            height: 200,
          }}
        ></Rnd>
      );
    }

    return null;
  };

  return <>{getMainComponent()}</>;
};
