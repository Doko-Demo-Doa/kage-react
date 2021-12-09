import { useContext, useEffect, useState } from "react";
import { Tabs } from "antd";
import { ipcRenderer } from "electron";
import { HomeOutlined, FileOutlined, SettingOutlined } from "@ant-design/icons";
import { ElectronEventType, SLIDE_HTML_ENTRY_FILE } from "~/common/static-data";
import { StoreContext } from "~/mobx/store-context";
import { fileUtils } from "~/utils/utils-files";
import { uiUtils } from "~/utils/utils-ui";
import i18n from "~/common/i18n";
import { SlideBuilder } from "~/routes/authen/builder/slide-builder/slide-builder";
import { QuizBuilder } from "~/routes/authen/builder/quiz-builder/quiz-builder";
import { SettingsRoute } from "~/routes/authen/settings/settings-route";

import { EventBus } from "~/services/events-helper";

const { TabPane } = Tabs;

import "~/routes/authen/builder/builder.scss";

export function Builder() {
  const [tabKey, setTabKey] = useState("0");

  const store = useContext(StoreContext);
  const { importSlideTree } = store.slideListStore;
  const { setIndex, importMeta } = store.slideBuilderStore;

  useEffect(() => {
    const backupPath = fileUtils.getBackupFilePath();

    if (fileUtils.checkFileExists(backupPath)) {
      uiUtils.showConfirmation(
        "Chú ý",
        i18n.t("slide_tab.unexpected_close_description"),
        () => {
          // Code ok
          const zipContent = fileUtils.readZipEntries(backupPath);
          if (zipContent?.includes(SLIDE_HTML_ENTRY_FILE) && zipContent.includes("manifest.json")) {
            const manifest = fileUtils.extractZipToCache(backupPath);
            // Sau khi extract thì nạp vào bộ nhớ.
            if (manifest) {
              // Nạp manifest mới vào.
              const data = JSON.parse(manifest);
              importMeta(data.id);
              importSlideTree(data.layout);
              setIndex(0);
            }
          }
          fileUtils.deleteFileAt(backupPath);
        },
        () => {
          fileUtils.deleteFileAt(backupPath);
        }
      );
      return;
    }
    fileUtils.clearCacheDir();
    fileUtils.createCacheDir();
    EventBus.on("SWITCH_TAB", (nk: string) => {
      setTabKey(nk);
    });

    ipcRenderer.on(ElectronEventType.OPEN_APP_CLOSE_PROMPT, () => {
      uiUtils.showConfirmation(
        "Chú ý",
        "Bạn có muốn đóng ứng dụng?",
        () => {
          if (fileUtils.checkFileExists(backupPath)) {
            fileUtils.deleteFileAt(backupPath);
          }

          ipcRenderer.send(ElectronEventType.CLOSE_APP);
        },
        () => {
          ipcRenderer.send(ElectronEventType.ON_CANCEL_CLOSE_PROMPT);
        }
      );
    });

    return () => {
      EventBus.off("SWITCH_TAB", () => null);

      ipcRenderer.removeAllListeners(ElectronEventType.OPEN_APP_CLOSE_PROMPT);
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
          disabled
        >
          <SettingsRoute />
        </TabPane>
      </Tabs>
    </div>
  );
}
