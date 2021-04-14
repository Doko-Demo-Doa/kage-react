import React, { useState } from "react";
import clsx from "clsx";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HeartTwoTone,
  AudioTwoTone,
} from "@ant-design/icons";

import { MediaType } from "~/common/static-data";

import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";
import { Colors } from "~/common/colors";

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

  return (
    <>
      <div className="side-holder" />

      <div className={clsx("slide-entities", expanded ? "slide-entities-expanded" : "")}>
        <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        </div>
        <div className="slide-entities-expandable">
          <h2>Animation</h2>
          {Array.from(Array(30).keys()).map((n, idx) => (
            <SingleAnimationEntity type={MediaType.AUDIO} key={idx} />
          ))}
        </div>
      </div>
    </>
  );
};
