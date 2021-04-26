import React from "react";
import { MediaType } from "~/common/static-data";

type MediaPreviewPopupProps = {
  type: MediaType;
  assetName: string;
};

export const MediaPreviewPopup: React.FC<MediaPreviewPopupProps> = () => {
  return <div className="media-preview-popup">Test</div>;
};
