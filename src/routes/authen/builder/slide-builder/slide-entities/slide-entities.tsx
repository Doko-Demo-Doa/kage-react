import React, { useContext, useState } from "react";
import { Input, Divider, Empty } from "antd";
import { Container, Draggable } from "react-smooth-dnd";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";

import { dataUtils } from "~/utils/utils-data";

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
    setAnimationList,
    toggleAnimation,
    deleteBlock,
  } = store.slideListStore;
  const { selectedIndex } = store.slideBuilderStore;

  const currentSlide = list[selectedIndex];
  const slideTitle = currentSlide?.title || "";

  const blocks = currentSlide?.slideBlocks || [];
  const animations = currentSlide?.animations || [];

  const isQuiz = Boolean(currentSlide?.linkedQuizId);

  return (
    <div className="slide-entities">
      {selectedIndex < 0 || isQuiz ? (
        <Empty description="" />
      ) : (
        <>
          <p>Tiêu đề slide:</p>
          <Input
            placeholder="Tiêu đề slide"
            onChange={(e) => setTitle(e.target.value)}
            disabled={list.length <= 0}
            value={slideTitle}
            multiple
            maxLength={46}
            className="slide-title-input"
          />
          <Divider type="horizontal" />

          <h2>Các thành phần</h2>
          <div className="column1">
            {blocks.map((item) => {
              return (
                <BlockEntity
                  key={item.id}
                  assetName={item.assetName}
                  blockId={item.id}
                  type={item.type}
                  selected={currentSlide.selectedBlock === item.id}
                  onClick={() => {
                    selectBlock(item.id);
                  }}
                  onClickAnimation={(blockId) => toggleAnimation(blockId)}
                  onDelete={(blockId) => deleteBlock(blockId)}
                />
              );
            })}
          </div>

          <h2>Hiệu ứng</h2>
          <div className="column2">
            <KeyboardEventHandler>
              <Container
                onDrop={(e) => {
                  setAnimationList(dataUtils.createSortedList(animations, e));
                }}
              >
                {animations.map((item, idx) => {
                  return (
                    <Draggable key={`${item.id}`}>
                      <AnimationEntity
                        id={item.id}
                        idx={idx}
                        onClick={(id, blockId) => {
                          selectAnim(id);
                          selectBlock(blockId);
                        }}
                        onDeleteAnimation={(blockId) => toggleAnimation(blockId)}
                        selected={selectedAnim === item.id}
                        animationType={item.animationType}
                        blockId={item.blockId}
                        blocks={blocks}
                      />
                    </Draggable>
                  );
                })}
              </Container>
            </KeyboardEventHandler>
          </div>
        </>
      )}
    </div>
  );
});
