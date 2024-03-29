import { useContext, useEffect, useRef } from "react";
import { Result, Button } from "antd";
import { FileUnknownOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { formattingUtils } from "~/utils/utils-formatting";
import { DEFAULT_TITLE_FONT_SIZE } from "~/common/static-data";
import { StoreContext } from "~/mobx/store-context";
import { SlideBlock } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2.scss";
import { fileUtils } from "~/utils/utils-files";

export const SlideInteractiveEditor: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const {
    list,
    selectBlock,
    resizeBlock,
    modifyTextBlock,
    setBlockBgColor,
    dragBlock,
    dragAnchor,
  } = store.slideListStore;
  const { selectedIndex } = store.slideBuilderStore;

  const slideTitle = list[selectedIndex]?.title || "";
  const slideTitleFontSize = list[selectedIndex]?.titleFontSize || DEFAULT_TITLE_FONT_SIZE;

  const blocks = list[selectedIndex]?.slideBlocks ?? [];
  const anims = list[selectedIndex]?.animations ?? [];

  const quizId = list[selectedIndex]?.linkedQuizId;
  const bg = list[selectedIndex]?.background;

  const cRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);

    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  const onWindowResize = () => {
    fakeDrag();
  };

  const fakeDrag = () => {
    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    cRef.current?.dispatchEvent(clickEvent);
  };

  // Nếu lỗi thì bỏ hết những children trong Layer.
  return (
    <div className="i-editor-wrapper">
      {!quizId ? (
        <div
          id="slide-interactive-editor"
          ref={cRef}
          style={{
            backgroundImage: bg ? `url(${fileUtils.getSlideBackgroundUrl(bg)})` : undefined,
          }}
        >
          <h1 className="slide-title" style={{ fontSize: slideTitleFontSize }}>
            {formattingUtils.htmlToJSX(formattingUtils.furiganaTemplateToHTML(slideTitle || ""))}
          </h1>

          {blocks.map((n, idx) => {
            return (
              <SlideBlock
                key={n.id}
                idx={blocks.length - idx}
                bgColor="transparent"
                {...n}
                animations={anims}
                selected={n.id === list[selectedIndex]?.selectedBlock}
                onSelect={(blockId) => {
                  selectBlock(blockId);
                }}
                onDrag={(blockId, pos) => {
                  dragBlock(blockId, pos);
                }}
                onDragAnchor={(blockId, pos) => {
                  dragAnchor(blockId, pos);
                }}
                onResized={(blockId, pos, size) => {
                  resizeBlock(blockId, pos, size);
                }}
                onTextChanged={(blockId, newText) => {
                  modifyTextBlock(blockId, newText);
                }}
                onChangeBgColor={(blockId, newColor) => {
                  setBlockBgColor(blockId, newColor);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div id="quiz-placeholder-p">
          <Result
            icon={<FileUnknownOutlined />}
            title="Đây là trang quiz"
            subTitle={`ID: ${quizId}`}
            status="success"
            extra={<Button type="primary">Sang trang chỉnh sửa quiz</Button>}
          />
          ,
        </div>
      )}
    </div>
  );
});
