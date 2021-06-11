import React from "react";
import {
  FunctionOutlined,
  SoundTwoTone,
  PictureTwoTone,
  VideoCameraTwoTone,
  FontSizeOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import clsx from "clsx";
import { AnimationType, MediaType } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { Colors } from "~/common/colors";

import "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity.scss";

type AnimationEntityProps = {
  id: string;
  idx?: number;
  animationType: AnimationType;
  blockId: string;
  blocks: Partial<SlideBlockType>[];
  selected?: boolean;
  onClick?: (animId: string, blockId: string) => void | undefined;
};

export const AnimationEntity: React.FC<AnimationEntityProps> = ({
  id,
  idx,
  blocks,
  blockId,
  selected,
  onClick,
}) => {
  const name = `Hiệu ứng ${(idx || 0) + 1}`;

  function getIcon() {
    const type = blocks.find((b) => b.id === blockId)?.type;
    if (type === MediaType.AUDIO) {
      return <SoundTwoTone size={35} className="audio" twoToneColor={Colors.DODGER_BLUE} />;
    }
    if (type === MediaType.IMAGE) {
      return <PictureTwoTone twoToneColor={Colors.BUTTERSCOTCH} />;
    }
    if (type === MediaType.VIDEO) {
      return <VideoCameraTwoTone twoToneColor={Colors.PALE_RED} />;
    }
    if (type === MediaType.TEXT_BLOCK) {
      return <FontSizeOutlined style={{ color: Colors.INDIGO }} />;
    }
    return <HeartTwoTone twoToneColor={Colors.GOLD_LIGHT} />;
  }

  return (
    <div
      className={clsx("animation-entity", selected ? "animation-entity-selected" : "")}
      onClick={() => onClick?.(id, blockId)}
    >
      <FunctionOutlined style={{ color: Colors.BARBIE_PINK }} />
      <div className="separator" />
      {getIcon()}
      <div className="separator" />
      <div className="fx-name">{name}</div>
    </div>
  );
};
