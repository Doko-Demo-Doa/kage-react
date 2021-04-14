import { Tabs } from "antd";
import { HomeOutlined, FileOutlined, SettingOutlined } from "@ant-design/icons";
import { SlideBuilder } from "~/routes/authen/builder/slide-builder/slide-builder";
import { QuizBuilder } from "~/routes/authen/builder/quiz-builder/quiz-builder";

const { TabPane } = Tabs;

import "~/routes/authen/builder/builder.scss";

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
          key="1"
        >
          <SlideBuilder />
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileOutlined />
              Quiz
            </span>
          }
          key="2"
        >
          <QuizBuilder />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Settings
            </span>
          }
          key="3"
        >
          <p>Content of Tab Pane 3</p>
          <p>Content of Tab Pane 3</p>
          <p>Content of Tab Pane 3</p>
        </TabPane>
      </Tabs>
    </div>
  );
}
