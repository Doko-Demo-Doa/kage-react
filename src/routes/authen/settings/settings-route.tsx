import React from "react";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

import "~/routes/authen/settings/settings-route.scss";

export const SettingsRoute: React.FC = () => {
  return (
    <div className="settings-route">
      <Layout>
        <Sider>Sider</Sider>
        <Layout>
          <Header>Header</Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </div>
  );
};
