import React, { useState } from "react";
import clsx from "clsx";
import { Input, Divider, Popover, Space, Checkbox } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HeartTwoTone,
  SoundTwoTone,
  PictureTwoTone,
} from "@ant-design/icons";

import { useRecoilState } from "recoil";

import { MediaType } from "~/common/static-data";
import { Colors } from "~/common/colors";
import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { slideListState } from "~/atoms/slide-list-atom";

import "react-h5-audio-player/lib/styles.css";
import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";
import { MediaPreviewPopup } from "~/components/media-preview-popup/media-preview-popup";

type AnimationEntityType = {
  type: MediaType;
  assetName: string;
};

const SingleAnimationEntity: React.FC<AnimationEntityType> = ({ type, assetName }) => {
  function getIcon() {
    if (type === MediaType.AUDIO) {
      return <SoundTwoTone size={35} className="audio" twoToneColor={Colors.DODGER_BLUE} />;
    }

    if (type === MediaType.IMAGE) {
      return <PictureTwoTone twoToneColor={Colors.BUTTERSCOTCH} />;
    }
    return <HeartTwoTone twoToneColor={Colors.BARBIE_PINK} />;
  }

  return (
    <div className="entity-cell">
      <Checkbox />

      <Popover
        arrowContent
        content={<MediaPreviewPopup assetName={assetName} type={type} />}
        destroyTooltipOnHide
      >
        <div className="cell-selectable">
          {getIcon()}
          <div className="entity-label">{assetName}</div>
        </div>
      </Popover>
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
          <h2>Thành phần</h2>
          <Space direction="vertical">
            {blocks.map((n, idx) => (
              <SingleAnimationEntity key={idx} assetName={n.assetName ?? ""} type={n.type} />
            ))}
          </Space>
        </div>
      </div>
    </>
  );
};
