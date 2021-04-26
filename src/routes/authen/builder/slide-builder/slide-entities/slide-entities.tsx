import React, { useState, useMemo, useRef } from "react";
import clsx from "clsx";
import { Input, Divider, Popover, Space, Checkbox } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HeartTwoTone,
  SoundTwoTone,
  PictureTwoTone,
  StopTwoTone,
} from "@ant-design/icons";
import AudioPlayer from "react-h5-audio-player";

import { useRecoilState } from "recoil";

import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { Colors } from "~/common/colors";
import { fileUtils } from "~/utils/utils-files";
import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { slideListState } from "~/atoms/slide-list-atom";

import "react-h5-audio-player/lib/styles.css";
import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

type AnimationEntityType = {
  type: MediaType;
  assetName: string;
};

const SingleAnimationEntity: React.FC<AnimationEntityType> = ({ type, assetName }) => {
  const assetUrl = useMemo(
    () => `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`,
    [assetName]
  );

  const aRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function getIcon() {
    if (type === MediaType.AUDIO) {
      const Comp = playing ? StopTwoTone : SoundTwoTone;
      return (
        <Comp
          size={35}
          className="audio"
          twoToneColor={Colors.DODGER_BLUE}
          onClick={() => toggleAudio()}
        />
      );
    }

    if (type === MediaType.IMAGE) {
      return <PictureTwoTone twoToneColor={Colors.BUTTERSCOTCH} />;
    }
    return <HeartTwoTone twoToneColor={Colors.BARBIE_PINK} />;
  }

  function toggleAudio() {
    if (!playing) {
      aRef.current?.play();
      setPlaying(true);
    } else {
      aRef.current?.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="entity-cell">
      {getIcon()}
      <div className="entity-label">Data</div>

      {type === MediaType.AUDIO && (
        <audio ref={aRef}>
          <source src={assetUrl} type="audio/mpeg" />
          Not supported.
        </audio>
      )}
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
              <Popover
                key={idx}
                arrowContent
                content={
                  <AudioPlayer
                    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                    style={{ width: "300px" }}
                    showJumpControls={false}
                    customAdditionalControls={[]}
                  />
                }
                destroyTooltipOnHide
              >
                <Checkbox key={idx}>
                  <ArrowRightOutlined />
                  {n.assetName ?? ""}
                </Checkbox>{" "}
              </Popover>
            ))}
          </Space>
        </div>
      </div>
    </>
  );
};
