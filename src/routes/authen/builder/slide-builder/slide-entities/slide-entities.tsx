import React, { useContext, useState } from "react";
import { Input, Divider, Empty, Checkbox, InputNumber } from "antd";
import { Container, Draggable } from "react-smooth-dnd";
import ScrollBar from "react-perfect-scrollbar";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";

import { dataUtils } from "~/utils/utils-data";
import { DEFAULT_TITLE_FONT_SIZE } from "~/common/static-data";

import { BackgroundPicker } from "~/routes/authen/builder/slide-builder/slide-entities/background-picker/background-picker";
import { AnimationEntity } from "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity";
import { BlockEntity } from "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

export const SlideEntities: React.FC = observer(() => {
  const [selectedAnim, selectAnim] = useState("");

  const store = useContext(StoreContext);
  const {
    list,
    selectBlock,
    setTitle,
    setTitleFontSize,
    setHidden,
    setAnimationIndex,
    toggleAnimation,
    toggleBlockVisibility,
    toggleMediaAutoplay,
    deleteBlock,
    setBlockList,
  } = store.slideListStore;
  const { selectedIndex } = store.slideBuilderStore;

  const currentSlide = list[selectedIndex];
  const slideTitle = currentSlide?.title || "";
  const slideTitleFontSize = currentSlide?.titleFontSize || DEFAULT_TITLE_FONT_SIZE;

  const blocks = currentSlide?.slideBlocks || [];
  const animations = currentSlide?.animations || [];

  const isQuiz = Boolean(currentSlide?.linkedQuizId);

  return (
    <ScrollBar className="slide-entities">
      {selectedIndex < 0 || isQuiz ? (
        <Empty description="" />
      ) : (
        <>
          <p>Tiêu đề slide:</p>
          <div className="title-config">
            <Input
              placeholder="Tiêu đề slide"
              onChange={(e) => setTitle(e.target.value)}
              disabled={list.length <= 0}
              value={slideTitle}
              multiple
              maxLength={46}
              className="slide-title-input"
            />
            <div style={{ width: "6px" }} />
            <InputNumber value={slideTitleFontSize} onChange={(v) => setTitleFontSize(v)} />
          </div>
          <br />
          <br />
          <Checkbox
            checked={Boolean(currentSlide?.isHidden)}
            onChange={() => setHidden(!currentSlide?.isHidden)}
          >
            Ẩn slide này khi tự học
          </Checkbox>

          <br />
          <br />

          <BackgroundPicker />
          <Divider type="horizontal" />

          <h2>Các thành phần</h2>
          <div className="column1">
            <Container
              onDrop={(e) => {
                setBlockList(dataUtils.createSortedList(blocks, e));
              }}
            >
              {blocks.map((item) => {
                return (
                  <Draggable key={item.id}>
                    <BlockEntity
                      key={item.id}
                      assetName={item.assetName}
                      blockId={item.id}
                      type={item.type}
                      isHidden={item.isHidden}
                      selected={currentSlide.selectedBlock === item.id}
                      onClick={() => {
                        selectBlock(item.id);
                      }}
                      onDoubleClick={(blockId) => toggleBlockVisibility(blockId)}
                      onClickAnimation={(blockId) => toggleAnimation(blockId)}
                      onDelete={(blockId) => deleteBlock(blockId)}
                    />
                  </Draggable>
                );
              })}
            </Container>
          </div>

          <h2>Hiệu ứng</h2>
          <div className="column2">
            <KeyboardEventHandler>
              {animations.map((item, idx) => {
                const targetAnim = list[selectedIndex].animations.find(
                  (n) => n.blockId === item.blockId
                );

                return (
                  <AnimationEntity
                    key={`${item.id}`}
                    id={item.id}
                    idx={idx}
                    animIdx={targetAnim?.animationIndex || 0}
                    onClick={(id, blockId) => {
                      selectAnim(id);
                      selectBlock(blockId);
                    }}
                    onDeleteAnimation={(blockId) => toggleAnimation(blockId)}
                    onChangeAnimationIndex={(animId, blockId, animIdx) =>
                      setAnimationIndex(animId, blockId, animIdx)
                    }
                    onChangeAutoplayMedia={(blockId) => toggleMediaAutoplay(blockId)}
                    mediaAutoplay={item.mediaAutoplay}
                    selected={selectedAnim === item.id}
                    animationType={item.animationType}
                    blockId={item.blockId}
                    blocks={blocks}
                  />
                );
              })}
            </KeyboardEventHandler>
          </div>
        </>
      )}
    </ScrollBar>
  );
});
