import { useContext } from "react";

import { observer } from "mobx-react";
import { furiganaTemplateToHTML, htmlToJSX } from "~/utils/utils-formatting";
import { StoreContext } from "~/mobx/store-context";
import { SlideBlock } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2.scss";

export const SlideInteractiveEditor: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const {
    list,
    selectBlock,
    resizeBlock,
    modifyTextBlock,
    dragBlock,
    dragAnchor,
    toggleAnimation,
  } = store.slideListStore;
  const { selectedIndex } = store.slideBuilderStore;

  const slideTitle = list[selectedIndex]?.title || "";

  const blocks = list[selectedIndex]?.slideBlocks ?? [];
  const anims = list[selectedIndex]?.animations ?? [];

  // Nếu lỗi thì bỏ hết những children trong Layer.
  return (
    <>
      <div id="slide-interactive-editor">
        <h1 className="slide-title">{htmlToJSX(furiganaTemplateToHTML(slideTitle || ""))}</h1>

        {blocks.map((n, i) => {
          return (
            <SlideBlock
              key={i}
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
              onToggleAnimation={(blockId) => {
                toggleAnimation(blockId);
              }}
            />
          );
        })}
      </div>
    </>
  );
});
