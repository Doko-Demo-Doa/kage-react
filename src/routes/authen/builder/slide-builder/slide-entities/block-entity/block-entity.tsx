import React from "react";
import clsx from "clsx";
import {
  VideoCameraTwoTone,
  HeartTwoTone,
  SoundTwoTone,
  PictureTwoTone,
  FontSizeOutlined,
  WechatFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Popover } from "antd";

import { dataUtils } from "~/utils/utils-data";
import { MediaType } from "~/common/static-data";
import { Colors } from "~/common/colors";
import { MediaPreviewPopup } from "~/components/media-preview-popup/media-preview-popup";
import CssColors from "~/assets/styles/_colors.module.scss";

import "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity.scss";

type BlockEntityType = {
  type: MediaType;
  blockId: string;
  assetName?: string;
  selected?: boolean;
  isHidden?: boolean;
  onClick?: (blockId: string) => void | undefined;
  onDoubleClick?: (blockId: string) => void | undefined;
  onClickAnimation?: (blockId: string) => void | undefined;
  onDelete?: (blockId: string) => void | undefined;
};

export const BlockEntity: React.FC<BlockEntityType> = ({
  type,
  blockId,
  assetName,
  selected,
  isHidden,
  onClick,
  onDoubleClick,
  onClickAnimation,
  onDelete,
}) => {
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => onClickAnimation?.(blockId)}>
        Tạo hiệu ứng
      </Menu.Item>
      <Menu.Item style={{ color: Colors.PALE_RED }} key="2" onClick={() => onDelete?.(blockId)}>
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

  function mainItem() {
    return (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className={clsx("entity-cell", selected ? "entity-cell-selected" : "")}
          onClick={() => onClick?.(blockId)}
          onDoubleClick={() => {
            onDoubleClick?.(blockId);
          }}
        >
          <div className="cell-selectable">{getIcon()}</div>
          <div className="cell-label">{dataUtils.mapMediaTypeName(type)}</div>
          {isHidden ? (
            <EyeInvisibleOutlined style={{ color: CssColors.colorRed, fontSize: "1.3em" }} />
          ) : (
            <EyeOutlined style={{ color: CssColors.colorBlueLight, fontSize: "1.3em" }} />
          )}
        </div>
      </Dropdown>
    );
  }

  if (type === MediaType.TEXT_BLOCK) {
    return mainItem();
  }

  return (
    <Popover
      arrowContent
      content={<MediaPreviewPopup assetName={assetName || ""} type={type} />}
      destroyTooltipOnHide
      title="Xem trước nội dung"
    >
      {mainItem()}
    </Popover>
  );
};
