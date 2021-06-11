import React, { useContext, useState } from "react";
import { Input, Divider } from "antd";
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
  const { list, selectBlock, setTitle, setAnimationList, toggleAnimation } = store.slideListStore;
  const { selectedIndex } = store.slideBuilderStore;

  const slideTitle = list[selectedIndex]?.title || "";

  const blocks = list[selectedIndex]?.slideBlocks || [];
  const animations = list[selectedIndex]?.animations || [];

  return (
    <div className="slide-entities">
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
              onDoubleClick={(blockId) => toggleAnimation(blockId)}
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
            {animations.map((item) => {
              return (
                <Draggable key={`${item.id}`}>
                  <AnimationEntity
                    id={item.id}
                    onClick={(id, blockId) => {
                      selectAnim(id);
                      selectBlock(blockId);
                    }}
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
    </div>
  );
});
