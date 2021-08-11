import React from "react";
import {
  SoundTwoTone,
  PictureTwoTone,
  VideoCameraTwoTone,
  FontSizeOutlined,
  WechatFilled,
  HeartTwoTone,
} from "@ant-design/icons";
import { Menu, Dropdown, InputNumber } from "antd";
import clsx from "clsx";
import { AnimationType, MediaType } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { Colors } from "~/common/colors";

import "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity.scss";

type Props = {
  id: string;
  idx?: number;
  animIdx: number;
  animationType: AnimationType;
  blockId: string;
  blocks: Partial<SlideBlockType>[];
  selected?: boolean;
  onClick?: (animId: string, blockId: string) => void | undefined;
  onDeleteAnimation?: (blockId: string) => void | undefined;
  onChangeAnimationIndex?: (animId: string, blockId: string, index: number) => void | undefined;
};

export const AnimationEntity: React.FC<Props> = ({
  id,
  idx,
  animIdx,
  blocks,
  blockId,
  selected,
  onClick,
  onDeleteAnimation,
  onChangeAnimationIndex,
}) => {
  const menu = (
    <Menu>
      <Menu.Item
        style={{ color: Colors.PALE_RED }}
        key="2"
        onClick={() => onDeleteAnimation?.(blockId)}
      >
        Xoá animation
      </Menu.Item>
    </Menu>
  );

  const name = `Ani ${(idx || 0) + 1}`;

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
    if (type === MediaType.CALLOUT) {
      return <WechatFilled style={{ color: Colors.GREEN }} />;
    }
    return <HeartTwoTone twoToneColor={Colors.GOLD_LIGHT} />;
  }

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div
        className={clsx("animation-entity", selected ? "animation-entity-selected" : "")}
        onClick={() => onClick?.(id, blockId)}
      >
        <InputNumber
          style={{ width: 70 }}
          min={0}
          max={9999}
          defaultValue={animIdx}
          onChange={(e: number) => {
            onChangeAnimationIndex?.(id, blockId, e);
          }}
        />
        <div className="separator" />
        {getIcon()}
        <div className="separator" />
        <div className="fx-name">{name}</div>
      </div>
    </Dropdown>
  );
};
