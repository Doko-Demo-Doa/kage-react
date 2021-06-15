import React, { useState } from "react";
import { Menu } from "antd";
import { UserOutlined, UploadOutlined, SettingOutlined } from "@ant-design/icons";
import { GeneralSettings } from "~/routes/authen/settings/general/general-settings";
import { SettingKey } from "~/typings/types";

import "~/routes/authen/settings/settings-route.scss";

export const SettingsRoute: React.FC = () => {
  const [menuKey, setMenuKey] = useState<SettingKey>("auth");

  function getSettingLayout() {
    if (menuKey === "general") return <GeneralSettings />;
    return <GeneralSettings />;
  }

  return (
    <div className="settings-route">
      <div className="left-col">
        <Menu theme="light" mode="inline" defaultSelectedKeys={["general"]}>
          <Menu.Item key="auth" icon={<UserOutlined />} onClick={() => setMenuKey("auth")}>
            Tài khoản
          </Menu.Item>
          <Menu.Item key="general" icon={<SettingOutlined />} onClick={() => setMenuKey("general")}>
            Thiết lập chung
          </Menu.Item>
          <Menu.Item key="upload" icon={<UploadOutlined />} onClick={() => setMenuKey("upload")}>
            Tải lên
          </Menu.Item>
        </Menu>
      </div>

      <div className="right-col">{getSettingLayout()}</div>
    </div>
  );
};
