import React, { useState } from "react";
import clsx from "clsx";
import { Input, Divider } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HeartTwoTone,
  AudioTwoTone,
  PictureTwoTone,
} from "@ant-design/icons";
import { useRecoilState } from "recoil";

import { MediaType } from "~/common/static-data";
import { Colors } from "~/common/colors";
import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { slideListState } from "~/atoms/slide-list-atom";

import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

type AnimationEntityType = {
  type: MediaType;
};

const SingleAnimationEntity: React.FC<AnimationEntityType> = ({ type }) => {
  function getIcon() {
    if (type === MediaType.AUDIO) return <AudioTwoTone twoToneColor={Colors.DODGER_BLUE} />;
    if (type === MediaType.IMAGE) return <PictureTwoTone twoToneColor={Colors.BUTTERSCOTCH} />;
    return <HeartTwoTone twoToneColor={Colors.BARBIE_PINK} />;
  }

  return (
    <div className="entity-cell">
      {getIcon()}
      <div className="entity-label">Data image</div>
    </div>
  );
};

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

  return (
    <>
      <div className="side-holder" />
      <div className={clsx("slide-entities", expanded ? "slide-entities-expanded" : "")}>
        <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        </div>
        <div className="slide-entities-expandable">
          <Input
            placeholder="Slide title"
            onChange={(e) => setSlideTitle(e.target.value)}
            disabled={slideList.length <= 0}
            value={slideTitle}
            defaultValue=""
          />
          <Divider type="horizontal" />
          <h2>Objects</h2>
          {blocks.map((n, idx) => (
            <SingleAnimationEntity type={n.type} key={idx} />
          ))}
        </div>
      </div>
    </>
  );
};
