import { useEffect, useState } from "react";
import { Tabs } from "antd";
import { HomeOutlined, FileOutlined, SettingOutlined } from "@ant-design/icons";
import { SlideBuilder } from "~/routes/authen/builder/slide-builder/slide-builder";
import { QuizBuilder } from "~/routes/authen/builder/quiz-builder/quiz-builder";
import { SettingsRoute } from "~/routes/authen/settings/settings-route";

import { EventBus } from "~/services/events-helper";

const { TabPane } = Tabs;

import "~/routes/authen/builder/builder.scss";

export function Builder() {
  const [tabKey, setTabKey] = useState("0");

  useEffect(() => {
    EventBus.on("SWITCH_TAB", (nk: string) => {
      setTabKey(nk);
    });

    return () => {
      EventBus.off("SWITCH_TAB", () => null);
    };
  }, []);

  return (
    <div className="main-layout editor-wrapper">
      <Tabs
        type="card"
        defaultActiveKey="0"
        activeKey={tabKey}
        onChange={(nk) => setTabKey(nk)}
        className="tabs-wrapper"
      >
        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Slides
            </span>
          }
          key="0"
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
          key="1"
        >
          <QuizBuilder />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Điều chỉnh
            </span>
          }
          key="2"
        >
          <SettingsRoute />
        </TabPane>
      </Tabs>
    </div>
  );
}
