import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Delta } from "quill";
import { PlusOutlined } from "@ant-design/icons";
import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { Calllout } from "~/components/callout/callout";
import { SlideAnimationType, SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { htmlToJSX, quillDeltaToHtml } from "~/utils/utils-formatting";
import { uiUtils } from "~/utils/utils-ui";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2.scss";

type SlideBlockComponentType = SlideBlockType & {
  selected?: boolean;
  animations?: SlideAnimationType[];
  onSelect: (id: string) => void | undefined;
  onDrag?: (blockId: string, pos: { x: number; y: number }) => void | undefined;
  onResized?: (
    blockId: string,
    topLeft: { x: number; y: number },
    size: { w: number; h: number }
  ) => void | undefined;
  onTextChanged?: (blockId: string, newText: Delta | undefined) => void | undefined;
  onToggleAnimation?: (blockId: string) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({
  id,
  type,
  assetName,
  size,
  position,
  deltaContent,
  selected,
  animations,
  onSelect,
  onDrag,
  onResized,
  onTextChanged,
  onToggleAnimation,
}) => {
  const textBlockRef = useRef<HTMLDivElement>(null);

  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory("assets")}/${assetName}`;
  const animIndex = animations?.findIndex((n) => n.blockId === id);

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
    initX = position.x;
    initY = position.y;
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
          resizeHandleClasses={
            selected
              ? {
                  bottomLeft: "c-handle",
                  topLeft: "c-handle",
                  topRight: "c-handle",
                  bottomRight: "c-handle",
                }
              : undefined
          }
          onDragStart={() => onSelect(id)}
          onDragStop={(e, d) => {
            const topLeftX = d.x;
            const topLeftY = d.y;
            onDrag?.(id, { x: topLeftX, y: topLeftY });
          }}
          onResizeStop={(mouseEvent, direction, element, delta, position) => {
            const newW = blockW + delta.width;
            const newH = blockH + delta.height;

            setBlockW(newW);
            setBlockH(newH);

            const newX = position.x;
            const newY = position.y;

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
          <div className="imageblock-holder" onClick={() => onSelect(id)}>
            {selected && (
              <div
                className="animation-anchor"
                title="Click đôi để thêm animation"
                onDoubleClick={() => onToggleAnimation?.(id)}
              >
                {animIndex !== undefined && animIndex > -1 ? `${animIndex + 1}` : <PlusOutlined />}
              </div>
            )}
          </div>
        </Rnd>
      );
    }

    if (type === MediaType.TEXT_BLOCK) {
      const ops = deltaContent?.ops;
      const html = quillDeltaToHtml(ops!);
      return (
        <Rnd
          bounds="parent"
          onDragStop={(e, d) => {
            const topLeftX = d.x;
            const topLeftY = d.y;

            onDrag?.(id, { x: topLeftX, y: topLeftY });
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

    if (type === MediaType.CALLOUT) {
      <Rnd
        bounds="parent"
        onDragStop={(e, d) => {
          const topLeftX = d.x;
          const topLeftY = d.y;

          onDrag?.(id, { x: topLeftX, y: topLeftY });
        }}
        position={{
          x: initX,
          y: initY,
        }}
      >
        <Calllout name="callout-rect-left" />
      </Rnd>;
    }

    return null;
  };

  return <>{getMainComponent()}</>;
};
