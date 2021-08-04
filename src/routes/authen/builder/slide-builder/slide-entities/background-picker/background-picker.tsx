import { Popover } from "antd";
import { PictureFilled } from "@ant-design/icons";
import CssColors from "~/assets/styles/_colors.module.scss";

import "~/routes/authen/builder/slide-builder/slide-entities/background-picker/background-picker.scss";
import { fileUtils } from "~/utils/utils-files";

export const BackgroundPicker = () => {
  return (
    <Popover content={<BackgroundGallery />} arrowPointAtCenter placement="leftTop" trigger="click">
      <div className="background-picker">
        <PictureFilled
          style={{
            color: CssColors.colorBlueLight,
            fontSize: "24px",
          }}
        />
        <p>Chọn hình nền slide</p>
      </div>
    </Popover>
  );
};

const BackgroundGallery = () => {
  const stockBackgroundList = fileUtils.getStockBackgroundsMeta().list;

  return (
    <>
      <h2>Chọn hình nền cho slide</h2>
      <div className="background-gallery">
        {stockBackgroundList.map((n) => (
          <div className="background-item" key={n.file}>
            <div
              className="inner"
              style={{
                backgroundImage: `url(${fileUtils.getSlideBackgroundUrl(n.file)})`,
              }}
            />
            <p>{n.label}</p>
          </div>
        ))}
      </div>
    </>
  );
};
