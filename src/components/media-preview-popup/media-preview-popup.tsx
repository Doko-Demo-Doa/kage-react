import React from "react";
import clsx from "clsx";
import AudioPlayer from "react-h5-audio-player";
import { MediaType } from "~/common/static-data";
import { fileUtils } from "~/utils/utils-files";

import "~/components/media-preview-popup/media-preview-popup.scss";

type MediaPreviewPopupProps = {
  type: MediaType;
  assetName: string;
};

export const MediaPreviewPopup: React.FC<MediaPreviewPopupProps> = ({ assetName, type }) => {
  const getMainComponent = () => {
    if (type === MediaType.AUDIO) {
      return (
        <AudioPlayer
          src={fileUtils.getUsableAssetUrl(assetName)}
          style={{ width: "100%" }}
          showJumpControls={false}
          customAdditionalControls={[]}
        />
      );
    }

    if (type === MediaType.IMAGE) {
      return <img className="preview-img" src={fileUtils.getUsableAssetUrl(assetName)} />;
    }

    if (type === MediaType.VIDEO) {
      return <video className="preview-img" src={fileUtils.getUsableAssetUrl(assetName)} />;
    }
  };

  return (
    <div
      className="media-preview-popup"
      style={{ width: type === MediaType.AUDIO ? "300px" : undefined }}
    >
      {getMainComponent()}
    </div>
  );
};
