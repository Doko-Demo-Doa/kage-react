import React from "react";
import { Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import "~/routes/authen/settings/settings-route.scss";

export const SettingsRoute: React.FC = () => {
  return (
    <div className="settings-route">
      <div className="left-col">
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<SettingOutlined />}>
            Thiết lập chung
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Tài khoản
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            Tải lên
          </Menu.Item>
        </Menu>
      </div>

      <div className="right-col">222</div>
    </div>
  );
};
