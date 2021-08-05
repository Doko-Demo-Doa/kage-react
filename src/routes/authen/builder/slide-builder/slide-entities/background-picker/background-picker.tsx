import { useContext } from "react";
import { Popover } from "antd";
import { PictureFilled } from "@ant-design/icons";
import ScrollBar from "react-perfect-scrollbar";
import { fileUtils } from "~/utils/utils-files";
import CssColors from "~/assets/styles/_colors.module.scss";

import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-entities/background-picker/background-picker.scss";

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

  const store = useContext(StoreContext);
  const { setBackgroundForCurrentSlide } = store.slideListStore;

  return (
    <>
      <h2>Chọn hình nền cho slide</h2>
      <ScrollBar className="background-gallery">
        {stockBackgroundList.map((n) => (
          <div
            className="background-item"
            key={n.file}
            onClick={() => setBackgroundForCurrentSlide(n.file)}
          >
            <div
              className="inner"
              style={{
                backgroundImage: `url(${fileUtils.getSlideBackgroundUrl(n.file)})`,
              }}
            />
            <p>{n.label}</p>
          </div>
        ))}
      </ScrollBar>
    </>
  );
};
