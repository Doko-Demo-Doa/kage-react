import React, { useState } from "react";
import clsx from "clsx";
import { Input, Divider } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Container, Draggable } from "react-smooth-dnd";
import { AnimationEntity } from "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity";

import { useRecoilState } from "recoil";

import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { slideListState } from "~/atoms/slide-list-atom";
import { SlideBlockType } from "~/typings/types";

import "react-h5-audio-player/lib/styles.css";
import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

export const SlideEntities: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
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

  const blocks = slideList[slideBuilderMeta.selectedIndex]?.slideBlocks || [];
  const animations = slideList[slideBuilderMeta.selectedIndex]?.animations || [];

  const reorder = (list: SlideBlockType[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

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
          <h2>Hiệu ứng</h2>

          <Container>
            {animations.map((item) => {
              return (
                <Draggable key={item.id}>
                  <AnimationEntity
                    id={item.id}
                    animationType={item.animationType}
                    blockId={item.blockId}
                    blocks={blocks}
                  />
                </Draggable>
              );
            })}
          </Container>
        </div>
      </div>
    </>
  );
};
