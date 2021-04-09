import { Tabs } from "antd";
import { HomeOutlined, FileOutlined, SettingOutlined } from "@ant-design/icons";
import { SlideBuilder } from "~/routes/authen/builder/slide-builder/slide-builder";

const { TabPane } = Tabs;

import "./builder.scss";

export function Builder() {
  return (
    <div className="main-layout editor-wrapper">
      <Tabs type="card" className="tabs-wrapper">
        <TabPane
          tab={
            <span>
              <HomeOutlined />
                Slides
              </span>
          }
          key="1">
          <SlideBuilder />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileOutlined />
                Quiz
              </span>
          }
          key="2">
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
        </TabPane>
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Settings
              </span>
          }
          key="3">
          <p>Content of Tab Pane 3</p>
          <p>Content of Tab Pane 3</p>
          <p>Content of Tab Pane 3</p>
        </TabPane>
      </Tabs>
    </div>
  );
}
