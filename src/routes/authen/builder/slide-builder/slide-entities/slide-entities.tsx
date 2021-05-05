import React, { useState } from "react";
import clsx from "clsx";
import { Input, Divider } from "antd";
import dayjs from "dayjs";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { SlideType } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";
import { AnimationType } from "~/common/static-data";
import { AnimationEntity } from "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity";
import { BlockEntity } from "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity";

import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { slideListState } from "~/atoms/slide-list-atom";

import "react-h5-audio-player/lib/styles.css";
import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

export const SlideEntities: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedAnim, selectAnim] = useState("");
  const [slideList, setSlideList] = useRecoilState(slideListState);
  const [slideBuilderMeta] = useRecoilState(slideBuilderState);

  const slideTitle = slideList[slideBuilderMeta.selectedIndex]?.title;

  function setSlideTitle(newTitle: string) {
    const idx = slideBuilderMeta.selectedIndex;

    const newSlides = [...slideList];
    const targetSlide = { ...newSlides[slideBuilderMeta.selectedIndex] };
    if (!targetSlide) return;
    targetSlide.title = newTitle;

    const newArr = [...newSlides.slice(0, idx), targetSlide, ...newSlides.slice(idx + 1)];
    setSlideList(newArr);
  }

  const selectBlock = (blockId: string) => {
    const idx = slideBuilderMeta.selectedIndex;

    const newSlideArray = [...slideList];
    const activeSlide = { ...newSlideArray[idx] };
    activeSlide.selectedBlock = blockId;
    newSlideArray[idx] = activeSlide;

    setSlideList([...newSlideArray]);
  };

  const onToggleAnimation = (blockId: string) => {
    const newSlideArray: SlideType[] = dataUtils.convertToMutableData(slideList);
    const slideIndex = slideBuilderMeta.selectedIndex;
    const activeSlide = newSlideArray[slideIndex];

    const targetAnim = activeSlide.animations.findIndex((n) => n.blockId === blockId);

    if (targetAnim === -1) {
      activeSlide.animations.push({
        id: dayjs().unix().toString(),
        animationType: AnimationType.APPEAR,
        blockId,
      });
      newSlideArray[slideIndex] = activeSlide;

      setSlideList(newSlideArray);
    }
  };

  const blocks = slideList[slideBuilderMeta.selectedIndex]?.slideBlocks || [];
  const animations = slideList[slideBuilderMeta.selectedIndex]?.animations || [];

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
            disabled={slideList.length <= 0}
            value={slideTitle}
            defaultValue=""
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
              <KeyboardEventHandler>
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
