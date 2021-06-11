import React from "react";
import {
  VideoCameraTwoTone,
  HeartTwoTone,
  SoundTwoTone,
  PictureTwoTone,
  FontSizeOutlined,
  WechatFilled,
} from "@ant-design/icons";
import { Menu, Dropdown } from "antd";

import { dataUtils } from "~/utils/utils-data";
import { MediaType } from "~/common/static-data";
import { Colors } from "~/common/colors";

import "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity.scss";

type BlockEntityType = {
  type: MediaType;
  blockId: string;
  assetName?: string;
  onDoubleClick?: (blockId: string) => void | undefined;
};

export const BlockEntity: React.FC<BlockEntityType> = ({ type, blockId, onDoubleClick }) => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Tạo animation</Menu.Item>
      <Menu.Item style={{ color: Colors.PALE_RED }} key="2">
        Xoá
      </Menu.Item>
    </Menu>
  );

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
      return <WechatFilled size={35} style={{ color: Colors.GREEN }} />;
    }
    return <HeartTwoTone twoToneColor={Colors.BARBIE_PINK} />;
  }

  return (
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <div className="entity-cell">
        <div
          className="cell-selectable"
          onDoubleClick={() => {
            onDoubleClick?.(blockId);
          }}
        >
          {getIcon()}
        </div>
        <div className="cell-label">{dataUtils.mapMediaTypeName(type)}</div>
      </div>
    </Dropdown>
  );
};
