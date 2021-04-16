import React, { useState } from "react";
import clsx from "clsx";
import { Input, Divider } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HeartTwoTone,
  AudioTwoTone,
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
    return <HeartTwoTone twoToneColor={Colors.BARBIE_PINK} />;
  }

  return (
    <div className="entity-cell">
      {getIcon()}
      <div className="entity-label">Text Test</div>
    </div>
  );
};

export const SlideEntities: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [slideList] = useRecoilState(slideListState);
  const [slideBuilderMeta] = useRecoilState(slideBuilderState);

  return (
    <>
      <div className={clsx("slide-entities", expanded ? "slide-entities-expanded" : "")}>
        <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        </div>
        <div className="slide-entities-expandable">
          <Input placeholder="Tieu de slide" defaultValue="" />
          <Divider type="horizontal" />
          <h2>Animation</h2>
          {slideList[slideBuilderMeta.selectedIndex]?.slideBlocks.map((n, idx) => (
            <SingleAnimationEntity type={MediaType.AUDIO} key={idx} />
          ))}
        </div>
      </div>
    </>
  );
};
