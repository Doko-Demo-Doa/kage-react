import React from "react";
import { Popover, Checkbox } from "antd";
import { VideoCameraTwoTone, HeartTwoTone, SoundTwoTone, PictureTwoTone } from "@ant-design/icons";

import { MediaType } from "~/common/static-data";
import { Colors } from "~/common/colors";
import { MediaPreviewPopup } from "~/components/media-preview-popup/media-preview-popup";

import "react-h5-audio-player/lib/styles.css";
import "~/routes/authen/builder/slide-builder/slide-entities/block-entity/block-entity.scss";

type BlockEntityType = {
  type: MediaType;
  assetName?: string;
};

export const BlockEntity: React.FC<BlockEntityType> = ({ type, assetName }) => {
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
        <div className="cell-selectable">{getIcon()}</div>
      </Popover>
    </div>
  );
};
