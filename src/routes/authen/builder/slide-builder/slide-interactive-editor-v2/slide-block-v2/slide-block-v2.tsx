import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Delta } from "quill";
import { PlusOutlined, DragOutlined } from "@ant-design/icons";
import ReactQuill, { Quill } from "react-quill";
import { MediaType, MinimumCanvasSize, RESOURCE_PROTOCOL } from "~/common/static-data";
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
  onDragAnchor?: (blockId: string, pos: { x: number; y: number }) => void | undefined;
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
  anchor,
  deltaContent,
  selected,
  animations,
  onSelect,
  onDrag,
  onDragAnchor,
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
          dragHandleClassName="block-handle"
        >
          <div ref={textBlockRef} onClick={() => onSelect(id)} className="interactive-text-block">
            {selected && (
              <div
                className="block-handle animation-anchor"
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

    if (type === MediaType.CALLOUT && position && size && anchor) {
      const ANCHOR_SIZE = 8;

      const shiftLeg1 = size.w * 0.35;
      const shiftLeg2 = Math.min(size.w * 0.75, size.w * 0.35 + 120);

      const leg1 = { x: position.x + shiftLeg1, y: position.y + size.h };
      const leg2 = { x: position.x + shiftLeg2, y: position.y + size.h };

      return (
        <div className="interactive-callout">
          <Rnd
            bounds="#slide-interactive-editor"
            dragHandleClassName="block-handle"
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
            position={{
              x: position.x ?? 0,
              y: position.y ?? 0,
            }}
            default={{
              x: initX,
              y: initY,
              width: initW,
              height: initH,
            }}
            cancel=".quiller"
            style={{
              border: "1px solid black",
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
          >
            <div className="callout-inside" onClick={() => onSelect?.(id)}>
              {selected && (
                <div
                  className="block-handle animation-anchor"
                  title="Click đôi để thêm animation"
                  onDoubleClick={() => onToggleAnimation?.(id)}
                >
                  {animIndex !== undefined && animIndex > -1 ? (
                    `${animIndex + 1}`
                  ) : (
                    <DragOutlined />
                  )}
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
                bounds="#root"
                style={{ maxHeight: "100%" }}
                theme="bubble"
              />
            </div>
          </Rnd>
          <Rnd
            bounds="#slide-interactive-editor"
            disableDragging={false}
            enableResizing={false}
            onDragStop={(e, d) => {
              const topLeftX = d.x;
              const topLeftY = d.y;

              onDragAnchor?.(id, { x: topLeftX, y: topLeftY });
            }}
            position={{
              x: anchor.x,
              y: anchor.y,
            }}
          >
            <div
              style={{
                width: ANCHOR_SIZE,
                height: ANCHOR_SIZE,
                background: "white",
                border: "1px solid grey",
                transform: "translate(-2px,-2px)",
              }}
            />
          </Rnd>
          <svg
            style={{
              position: "absolute",
              zIndex: -1,
              width: MinimumCanvasSize.WIDTH,
              height: MinimumCanvasSize.HEIGHT,
            }}
          >
            <polyline
              points={`${leg1.x},${leg1.y} ${anchor.x},${anchor.y} ${leg2.x},${leg2.y}`}
              fill="transparent"
              stroke="black"
              style={{ position: "absolute" }}
            />
            Trình duyệt không hỗ trợ hiển thị
          </svg>
        </div>
      );
    }

    return null;
  };

  return <>{getMainComponent()}</>;
};
