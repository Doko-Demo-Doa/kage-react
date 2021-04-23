import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Delta } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { AppDefaults, MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { htmlToJSX } from "~/utils/utils-formatting";
import { uiUtils } from "~/utils/utils-ui";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2.scss";

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
  onTextChanged?: (blockId: string, newText: Delta | undefined) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({
  id,
  type,
  assetName,
  size,
  position,
  deltaContent,
  selected,
  onSelect,
  onDrag,
  onResized,
  onTextChanged,
}) => {
  const textBlockRef = useRef<HTMLDivElement>(null);

  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`;

  let initW = 0;
  let initH = 0;

  let initX = 0;
  let initY = 0;

  // Nếu có size thì tức là đã được
  // define size từ trước (ảnh hoặc video)
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

  useEffect(() => {
    if (type === MediaType.TEXT_BLOCK) {
      // Do text block không resize mà phụ thuộc vào nội dung của text
      // Nên ta cần tính toán luôn.
      initW = textBlockRef.current?.clientWidth ?? 0;
      initH = textBlockRef.current?.clientHeight ?? 0;
    }
  }, []);

  const updateTextBlockSize = () => {
    if (type === MediaType.TEXT_BLOCK) {
      const newW = textBlockRef.current?.clientWidth ?? 0;
      const newH = textBlockRef.current?.clientHeight ?? 0;
      setBlockW(newW);
      setBlockH(newH);
    }
  };

  const getMainComponent = () => {
    if (type === MediaType.IMAGE) {
      return (
        <Rnd
          bounds="parent"
          lockAspectRatio
          resizeHandleClasses={selected ? {
            bottomLeft: "c-handle",
            topLeft: "c-handle",
            topRight: "c-handle",
            bottomRight: "c-handle",
          } : undefined}
          onDragStart={() => onSelect(id)}
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
        >
          <div className="imageblock-holder" onClick={() => onSelect(id)} />
        </Rnd>
      );
    }

    if (type === MediaType.TEXT_BLOCK) {
      const ops = deltaContent?.ops;
      const converter = new QuillDeltaToHtmlConverter(ops!, {});
      const html = converter.convert();
      return (
        <Rnd
          onDragStop={(e, d) => {
            const topLeftX = d.x;
            const topLeftY = d.y;
            if (!size) return;
            const centerOriginW = topLeftX + blockW / 2;
            const centerOriginH = topLeftY + blockH / 2;

            onDrag?.(id, { x: centerOriginW, y: centerOriginH }, { w: blockW, h: blockH });
          }}
          position={{
            x: initX,
            y: initY,
          }}
          enableResizing={false}
        >
          <div
            ref={textBlockRef}
            onDoubleClick={() => {
              uiUtils.showQuillEditor(deltaContent || "", (data) => {
                updateTextBlockSize();
                onTextChanged?.(id, data);
              });
            }}
            className="interactive-text-block"
          >
            {htmlToJSX(html)}
          </div>
        </Rnd>
      );
    }

    return null;
  };

  return <>{getMainComponent()}</>;
};
