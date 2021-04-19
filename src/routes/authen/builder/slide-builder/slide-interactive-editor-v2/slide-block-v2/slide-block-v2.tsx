import React from "react";
import { Rnd } from "react-rnd";
import { MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

type SlideBlockComponentType = SlideBlockType & {
  selected?: boolean;
  onSelect: (id: string) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({ type, assetName }) => {
  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`;

  const getMainComponent = () => {
    if (type === MediaType.IMAGE) {
      return (
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 320,
            height: 200,
          }}
          style={{
            background: `url(${assetUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      );
    }

    return <div>Alt Text</div>;
  };

  return <>{getMainComponent()}</>;
};
