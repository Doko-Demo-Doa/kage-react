import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import { MediaType } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";

export const SlideBlock: React.FC<SlideBlockType> = ({ type, assetName }) => {
  const [image] = useImage(assetName || "");

  if (type === MediaType.IMAGE) {
    return <Image image={image} x={200} y={50} scaleX={0.3} scaleY={0.3} />;
  }
  return <React.Fragment>Test</React.Fragment>;
};
