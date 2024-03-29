import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "antd";
import { Rnd } from "react-rnd";
import clsx from "clsx";
import { Delta } from "quill";
import { PlusOutlined, BgColorsOutlined } from "@ant-design/icons";
import { TwitterPicker, BlockPicker } from "react-color";
import { DEFAULT_COLOR_PICKER_PALETTE, MediaType } from "~/common/static-data";
import { SlideAnimationType, SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { quillUtils } from "~/utils/utils-quill";
import { formattingUtils } from "~/utils/utils-formatting";
import { uiUtils } from "~/utils/utils-ui";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2.scss";

const MINIMUM_TEXT_BLOCK_WIDTH = 160; // In px

type SlideBlockComponentType = SlideBlockType & {
  idx: number;
  selected?: boolean;
  animations?: SlideAnimationType[];
  onSelect: (id: string) => void | undefined;
  onChangeBgColor?: (blockId: string, hexColor: string) => void | undefined;
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
  idx,
  type,
  assetName,
  size,
  position,
  anchor,
  bgColor,
  deltaContent,
  selected,
  animations,
  onSelect,
  onChangeBgColor,
  onDrag,
  onDragAnchor,
  onResized,
  onTextChanged,
  onToggleAnimation,
}) => {
  const textBlockRef = useRef<HTMLDivElement>(null);

  const assetUrl = fileUtils.getUsableAssetUrl(assetName);
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
      recalculateWrappingTextBlock();
    }
  }, []);

  function recalculateWrappingTextBlock() {
    // Sử dụng để tính toán lại kích thước của kích thước khổi.
    if (type === MediaType.TEXT_BLOCK) {
      // Do text block không resize mà phụ thuộc vào nội dung của text
      // Nên ta cần tính toán luôn.
      initW = textBlockRef.current?.clientWidth ?? 0;
      initH = textBlockRef.current?.clientHeight ?? 0;

      setBlockW(initW);
      setBlockH(initH);
    }
  }

  // Lấy idx chuẩn cho z-index:
  const layeredIndex = Math.abs(idx);

  const getMainComponent = () => {
    if (type === MediaType.IMAGE || type === MediaType.VIDEO) {
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
            zIndex: layeredIndex,
            ...(type === MediaType.IMAGE
              ? {
                  backgroundImage: `url(${assetUrl})`,
                }
              : {}),
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
            <video src={assetUrl} style={{ width: "100%", height: "100%" }} />
          </div>
        </Rnd>
      );
    }

    if (type === MediaType.TEXT_BLOCK) {
      return (
        <>
          <Rnd
            bounds="parent"
            onDragStop={(e, d) => {
              const topLeftX = d.x;
              const topLeftY = d.y;

              console.log("Event", e);
              console.log("Position", d);

              onDrag?.(id, { x: topLeftX, y: topLeftY });
            }}
            position={{
              x: initX,
              y: initY,
            }}
            minWidth={5}
            onResizeStop={(mouseEvent, direction, element, delta, position) => {
              const newW = blockW + delta.width;
              const newH = blockH + delta.height;

              setBlockW(newW);
              setBlockH(newH);

              const newX = position.x;
              const newY = position.y;

              onResized?.(id, { x: newX, y: newY }, { w: newW, h: newH });
            }}
            default={{
              x: initX,
              y: initY,
              width: initW,
              height: initH,
            }}
            size={{
              width: blockW || MINIMUM_TEXT_BLOCK_WIDTH,
              height: blockH,
            }}
            enableResizing={{
              top: false,
              right: true,
              bottom: false,
              left: true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            style={{
              zIndex: layeredIndex,
            }}
            className="single-block"
          >
            {selected && (
              <Dropdown
                overlay={
                  <BlockPicker
                    onChangeComplete={(col) => {
                      onChangeBgColor?.(id, col.hex);
                    }}
                    colors={DEFAULT_COLOR_PICKER_PALETTE}
                  />
                }
                trigger={["click"]}
              >
                <div className="block-handle animation-anchor" title="Click để đổi màu nền">
                  {animIndex !== undefined && animIndex > -1 ? (
                    `${animIndex + 1}`
                  ) : (
                    <BgColorsOutlined />
                  )}
                </div>
              </Dropdown>
            )}
            <div
              ref={textBlockRef}
              onClick={() => onSelect(id)}
              onDoubleClick={() =>
                uiUtils.showQuillEditor(deltaContent || "", (data) => {
                  onTextChanged?.(id, data);
                })
              }
              style={{ backgroundColor: bgColor || "transparent" }}
              onMouseDown={() => onSelect?.(id)}
              className={clsx(
                "text-block",
                "interactive-text-block",
                selected ? "interactive-text-block-selected" : ""
              )}
            >
              <div className="text-block-content">
                {formattingUtils.htmlToJSX(quillUtils.quillDeltaToHtml(deltaContent?.ops))}
              </div>
            </div>
          </Rnd>
        </>
      );
    }

    if (type === MediaType.CALLOUT && position && size && anchor) {
      const ANCHOR_SIZE = 8;

      const shiftLeg1 = size.w * 0.35;
      const shiftLeg2 = Math.min(size.w * 0.75, size.w * 0.35 + 120);

      const leg1 = { x: position.x + shiftLeg1, y: position.y + size.h - 1 };
      const leg2 = { x: position.x + shiftLeg2, y: position.y + size.h - 1 };

      return (
        <div
          className="interactive-callout"
          style={{
            zIndex: layeredIndex,
          }}
        >
          <Rnd
            bounds="#slide-interactive-editor"
            className="single-block"
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
            <div
              className="callout-inside"
              style={{ backgroundColor: bgColor || "transparent" }}
              onClick={() => onSelect?.(id)}
              onDoubleClick={() =>
                uiUtils.showQuillEditor(deltaContent || "", (data) => {
                  onTextChanged?.(id, data);
                })
              }
            >
              {selected && (
                <Dropdown
                  overlay={
                    <TwitterPicker
                      onChangeComplete={(col) => {
                        onChangeBgColor?.(id, col.hex);
                      }}
                      colors={DEFAULT_COLOR_PICKER_PALETTE}
                    />
                  }
                  trigger={["click"]}
                >
                  <div className="block-handle animation-anchor" title="Click để đổi màu nền">
                    {animIndex !== undefined && animIndex > -1 ? (
                      `${animIndex + 1}`
                    ) : (
                      <BgColorsOutlined />
                    )}
                  </div>
                </Dropdown>
              )}
              <div
                ref={textBlockRef}
                onClick={() => onSelect(id)}
                className="text-block"
                onMouseDown={() => onSelect?.(id)}
              >
                <div className="text-block-content">
                  {formattingUtils.htmlToJSX(quillUtils.quillDeltaToHtml(deltaContent?.ops))}
                </div>
              </div>
            </div>
          </Rnd>
          <Rnd
            className="single-block"
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
                zIndex: 10,
                border: "1px solid black",
                transform: "translate(-2px,-2px)",
              }}
            />
          </Rnd>
          <svg
            style={{
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <polyline
              points={`${leg1.x},${leg1.y} ${anchor.x},${anchor.y} ${leg2.x},${leg2.y}`}
              fill={bgColor}
              stroke={bgColor}
              overflow="visible"
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
