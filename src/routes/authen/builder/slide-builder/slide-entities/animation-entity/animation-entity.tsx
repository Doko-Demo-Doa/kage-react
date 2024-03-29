import React from "react";
import {
  SoundTwoTone,
  PictureTwoTone,
  VideoCameraTwoTone,
  FontSizeOutlined,
  WechatFilled,
  HeartTwoTone,
} from "@ant-design/icons";
import { Menu, Dropdown, InputNumber, Checkbox, Tooltip } from "antd";
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
  mediaAutoplay?: boolean;
  blockId: string;
  blocks: Partial<SlideBlockType>[];
  selected?: boolean;
  onClick?: (animId: string, blockId: string) => void | undefined;
  onDeleteAnimation?: (blockId: string) => void | undefined;
  onChangeAnimationIndex?: (animId: string, blockId: string, index: number) => void | undefined;
  onChangeAutoplayMedia?: (blockId: string) => void | undefined;
};

export const AnimationEntity: React.FC<Props> = ({
  id,
  animIdx,
  blocks,
  blockId,
  selected,
  mediaAutoplay,
  onClick,
  onDeleteAnimation,
  onChangeAnimationIndex,
  onChangeAutoplayMedia,
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

  const type = blocks.find((b) => b.id === blockId)?.type;

  function getIcon() {
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

  function getMediaAutoplayToggler() {
    if (type === MediaType.AUDIO) {
      return (
        <Tooltip overlay={<div>Chạy khi vào slide</div>}>
          <Checkbox
            defaultChecked={Boolean(mediaAutoplay)}
            onChange={() => onChangeAutoplayMedia?.(blockId)}
          >
            Auto
          </Checkbox>
        </Tooltip>
      );
    }
    return null;
  }

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div
        className={clsx("animation-entity", selected ? "animation-entity-selected" : "")}
        onClick={() => onClick?.(id, blockId)}
      >
        <InputNumber
          style={{ width: 70 }}
          min={1}
          max={9999}
          defaultValue={animIdx}
          onChange={(e: number) => {
            onChangeAnimationIndex?.(id, blockId, e);
          }}
          disabled={mediaAutoplay}
        />
        <div className="separator" />
        {getIcon()}
        <div className="separator" />
        {getMediaAutoplayToggler()}
      </div>
    </Dropdown>
  );
};
