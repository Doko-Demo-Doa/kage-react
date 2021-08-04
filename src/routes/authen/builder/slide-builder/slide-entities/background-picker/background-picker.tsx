import { PictureFilled } from "@ant-design/icons";
import CssColors from "~/assets/styles/_colors.module.scss";

import "~/routes/authen/builder/slide-builder/slide-entities/background-picker/background-picker.scss";

export const BackgroundPicker = () => {
  return (
    <div className="background-picker">
      <PictureFilled
        style={{
          color: CssColors.colorBlueLight,
          fontSize: "24px",
        }}
      />
      <p>Chọn hình nền slide</p>
    </div>
  );
};
