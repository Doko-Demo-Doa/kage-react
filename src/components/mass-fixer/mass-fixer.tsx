import React from "react";
import { Result, Button } from "antd";
import { CompressOutlined } from "@ant-design/icons";

import "~/components/mass-fixer/mass-fixer.scss";
import { fileUtils } from "~/utils/utils-files";

export const MassFixerComponent: React.FC = () => {
  function chooseFolder() {
    fileUtils.launchFolderOpenDialog();
  }

  return (
    <div className="fixer-component">
      <Result
        icon={<CompressOutlined />}
        title="Nâng cấp / sửa lỗi slide hàng loạt"
        subTitle='Đây là chức năng nâng cấp / sửa lỗi slide hàng loạt trong một folder.
        Click vào nút bên dưới để chọn thư mục, sau đó chương trình sẽ tự quét các file ".zip" hoặc ".dsa".'
        extra={
          <Button type="primary" onClick={() => chooseFolder()}>
            Chọn thư mục chứa bộ slide
          </Button>
        }
      />
    </div>
  );
};
