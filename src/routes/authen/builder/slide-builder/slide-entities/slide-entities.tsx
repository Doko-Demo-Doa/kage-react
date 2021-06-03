import React, { useContext, useState } from "react";
import { Input, Divider } from "antd";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";

import { AnimationEntity } from "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity";
import { BlockEntity } from "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

export const SlideEntities: React.FC = observer(() => {
  const [selectedAnim, selectAnim] = useState("");
  const store = useContext(StoreContext);
  const { list, selectBlock, setTitle, toggleAnimation } = store.slideListStore;
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
      <h2>Asset / Hiệu ứng</h2>

      <div className="asset-columns">
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

        <div className="separator" />

        <div className="column2">
          <KeyboardEventHandler
            handleKeys={["del"]}
            onKeyEvent={(key) => {
              if (key === "del") {
                // Code...
              }
            }}
          >
            {animations.map((item) => {
              return (
                <AnimationEntity
                  id={item.id}
                  key={item.id}
                  onClick={(id, blockId) => {
                    selectAnim(id);
                    selectBlock(blockId);
                  }}
                  selected={selectedAnim === item.id}
                  animationType={item.animationType}
                  blockId={item.blockId}
                  blocks={blocks}
                />
              );
            })}
          </KeyboardEventHandler>
        </div>
      </div>
    </div>
  );
});
