import React from "react";
import { Popover } from "antd";
import {
  VideoCameraTwoTone,
  HeartTwoTone,
  SoundTwoTone,
  PictureTwoTone,
  FontSizeOutlined,
  WechatFilled,
} from "@ant-design/icons";

import { MediaType } from "~/common/static-data";
import { Colors } from "~/common/colors";
import { MediaPreviewPopup } from "~/components/media-preview-popup/media-preview-popup";

import "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity.scss";

type BlockEntityType = {
  type: MediaType;
  blockId: string;
  assetName?: string;
  onDoubleClick?: (blockId: string) => void | undefined;
};

export const BlockEntity: React.FC<BlockEntityType> = ({
  type,
  assetName,
  blockId,
  onDoubleClick,
}) => {
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
      return <FontSizeOutlined color={Colors.DODGER_BLUE} />;
    }
    if (type === MediaType.CALLOUT) {
      return <WechatFilled size={35} style={{ color: Colors.GREEN }} />;
    }
    return <HeartTwoTone twoToneColor={Colors.BARBIE_PINK} />;
  }

  return (
    <div className="entity-cell">
      <Popover
        arrowContent
        content={<MediaPreviewPopup assetName={assetName ?? ""} type={type} />}
        trigger="click"
        destroyTooltipOnHide
      >
        <div
          className="cell-selectable"
          onDoubleClick={() => {
            if (type === MediaType.AUDIO) {
              onDoubleClick?.(blockId);
            }
          }}
        >
          {getIcon()}
        </div>
      </Popover>
    </div>
  );
};
