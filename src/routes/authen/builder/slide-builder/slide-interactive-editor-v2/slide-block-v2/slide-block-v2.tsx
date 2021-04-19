import React from "react";
import { Rnd } from "react-rnd";
import { AppDefaults, MediaType, RESOURCE_PROTOCOL } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

type SlideBlockComponentType = SlideBlockType & {
  selected?: boolean;
  onSelect: (id: string) => void | undefined;
};

export const SlideBlock: React.FC<SlideBlockComponentType> = ({ type, assetName, size }) => {
  const assetUrl = `${RESOURCE_PROTOCOL}${fileUtils.getCacheDirectory()}/${assetName}`;

  const getMainComponent = () => {
    if (type === MediaType.IMAGE) {
      return (
        <Rnd
          bounds="parent"
          onDragStop={(e, d) => {
            const topLeftX = d.x;
            const topLeftY = d.y;
            if (!size) return;
            const centerOriginW = size.w / 2;
            const centerOriginH = size.h / 2;
            console.log("Actual position: ", centerOriginW, centerOriginH);
          }}
          onResizeStop={(mouseEvent, direction, element, delta) => {
            // Code...
            console.log(delta);
          }}
          enableResizing={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          default={{
            x: 0,
            y: 0,
            width: AppDefaults.DEFAULT_IMAGE_SCALE * (size?.w ?? 0),
            height: AppDefaults.DEFAULT_IMAGE_SCALE * (size?.h ?? 0),
          }}
          style={{
            zIndex: 0,
            background: `url(${assetUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      );
    }

    if (type === MediaType.TABLE) {
      return (
        <Rnd
          onDragStop={(e, d) => {
            console.log(d);
            console.log(size);
          }}
          default={{
            x: 0,
            y: 0,
            width: 320,
            height: 200,
          }}
        >
          <table>
            <tbody>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Age</th>
              </tr>
              <tr>
                <td>Jill</td>
                <td>Smith</td>
                <td>50</td>
              </tr>
              <tr>
                <td>Eve</td>
                <td>Jackson</td>
                <td>94</td>
              </tr>
            </tbody>
          </table>
        </Rnd>
      );
    }

    return <div>Alt Text</div>;
  };

  return <>{getMainComponent()}</>;
};
