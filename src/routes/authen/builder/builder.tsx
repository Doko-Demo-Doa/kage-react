import { Tabs } from "antd";
import { HomeOutlined, FileOutlined, AntDesignOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

import "./builder.scss";

export function Builder() {
  return (
    <div className="main-layout editor-wrapper">
      <div className="editor-ribbon">
        <Tabs type="card">
          <TabPane
            tab={
              <span>
                <HomeOutlined />
                Tab 1
              </span>
            }
            key="1"
          >
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
          </TabPane>
          <TabPane tab="Tab Title 2" key="2">
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
          </TabPane>
          <TabPane tab="Tab Title 3" key="3">
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
