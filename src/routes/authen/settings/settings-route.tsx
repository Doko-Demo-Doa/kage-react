import React, { useState } from "react";
import { Menu, Layout } from "antd";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { GeneralSettings } from "~/routes/authen/settings/general/general-settings";
import { SettingKey } from "~/typings/types";

const { Content, Sider } = Layout;

import "~/routes/authen/settings/settings-route.scss";

export const SettingsRoute: React.FC = () => {
  const [menuKey, setMenuKey] = useState<SettingKey>("auth");

  function getSettingLayout() {
    if (menuKey === "general") return <GeneralSettings />;
    return <GeneralSettings />;
  }

  return (
    <div className="settings-route">
      <Layout className="site-layout-background" style={{ padding: "24px 0" }}>
        <Sider className="site-layout-background" width={200}>
          <Menu mode="inline" defaultSelectedKeys={["general"]} style={{ height: "100%" }}>
            <Menu.Item
              key="general"
              icon={<SettingOutlined />}
              onClick={() => setMenuKey("general")}
            >
              Cài đặt chung
            </Menu.Item>
            <Menu.Item key="auth" icon={<UserOutlined />} onClick={() => setMenuKey("auth")}>
              Tài khoản
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ padding: "0 24px", minHeight: 280 }}>{getSettingLayout()}</Content>
      </Layout>
    </div>
  );
};
