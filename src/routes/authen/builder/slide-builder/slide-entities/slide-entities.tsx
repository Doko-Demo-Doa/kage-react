import React, { useContext, useState, useMemo } from "react";
import clsx from "clsx";
import { Input, Divider } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { AnimationEntity } from "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity";
import { BlockEntity } from "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity";
import { StoreContext } from "~/mobx/store-context";

import "react-h5-audio-player/lib/styles.css";
import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

export const SlideEntities: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedAnim, selectAnim] = useState("");
  const store = useContext(StoreContext);
  const { list, selectBlock, setTitle, toggleAnimation } = store.slideListStore;
  const { selectedIndex } = store.slideBuilderStore;

  const slideTitle = useMemo(() => list[selectedIndex]?.title || "", [selectedIndex]);

  function setSlideTitle(newTitle: string) {
    setTitle(newTitle);
  }

  const onToggleAnimation = (blockId: string) => {
    toggleAnimation(blockId);
  };

  const blocks = list[selectedIndex]?.slideBlocks || [];
  const animations = list[selectedIndex]?.animations || [];

  return (
    <>
      <div className="side-holder" />
      <div className={clsx("slide-entities", expanded ? "slide-entities-expanded" : "")}>
        <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        </div>
        <div className="slide-entities-expandable">
          <p>Tiêu đề slide:</p>
          <Input
            placeholder="Slide title"
            onChange={(e) => setSlideTitle(e.target.value)}
            disabled={list.length <= 0}
            value={slideTitle}
            defaultValue={slideTitle}
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
                    onDoubleClick={(blockId) => onToggleAnimation(blockId)}
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
      </div>
    </>
  );
};
