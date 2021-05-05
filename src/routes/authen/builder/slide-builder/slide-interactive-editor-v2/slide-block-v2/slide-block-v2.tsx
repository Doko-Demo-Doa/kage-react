import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Delta } from "quill";
import { PlusOutlined, DragOutlined } from "@ant-design/icons";
import ReactQuill, { Quill } from "react-quill";
import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { Calllout } from "~/components/callout/callout";
import { SlideAnimationType, SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { defaultQuillToolbar } from "~/utils/utils-ui";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2.scss";

const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = ["10px", "15px", "18px", "20px", "32px", "54px"];
Quill.register(SizeStyle, true);

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
  const quillRef = useRef<ReactQuill>(null);

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
          dragHandleClassName="handle"
        >
          <div ref={textBlockRef} onClick={() => onSelect(id)} className="interactive-text-block">
            {selected && (
              <div
                className="handle animation-anchor"
                title="Click đôi để thêm animation"
                onDoubleClick={() => onToggleAnimation?.(id)}
              >
                {animIndex !== undefined && animIndex > -1 ? `${animIndex + 1}` : <DragOutlined />}
              </div>
            )}

            <ReactQuill
              ref={quillRef}
              defaultValue={deltaContent}
              className="quiller"
              modules={{
                toolbar: defaultQuillToolbar,
              }}
              onChange={() => {
                const data = quillRef.current?.getEditor().getContents();
                onTextChanged?.(id, data);
              }}
              theme="bubble"
            />
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
        <div />
      </Rnd>;
    }

    return null;
  };

  return <>{getMainComponent()}</>;
};
