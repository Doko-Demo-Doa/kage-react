import React, { useContext, useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import dayjs from "dayjs";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { ElectronEventType } from "~/common/static-data";
import { StoreContext } from "~/mobx/store-context";

import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";
import { SlideList } from "~/routes/authen/builder/slide-builder/slide-list/slide-list";
import { SlideInteractiveEditor } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2";
import { SlideEntities } from "~/routes/authen/builder/slide-builder/slide-entities/slide-entities";

import packageMeta from "../../../../../package.json";

import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  const store = useContext(StoreContext);

  const { setLastSavedTime, currentWorkingFile } = store.slideBuilderStore;

  useEffect(() => {
    ipcRenderer.on(ElectronEventType.DOWNLOAD_PROGRESS, (event, percent: number) => {
      setUpdateProgress(percent);
    });

    ipcRenderer.on(ElectronEventType.UPDATE_DOWNLOADED, () => {
      setUpdateDownloaded(true);
    });

    /**
     * Kiểm tra: Nếu không có currentWorkingFile thì lưu file thường xuyên theo interval vào thư mục cache.
     * Nếu có rồi thì lưu theo interval vào thư mục chỉ định của currentWorkingFile
     */
    if (currentWorkingFile) {
      console.log(currentWorkingFile);
    }

    return () => {
      ipcRenderer.removeAllListeners(ElectronEventType.DOWNLOAD_PROGRESS);
      ipcRenderer.removeAllListeners(ElectronEventType.UPDATE_DOWNLOADED);
    };
  }, []);

  return (
    <KeyboardEventHandler
      handleKeys={["ctrl + s", "Cmd + s"]}
      isExclusive
      onKeyEvent={() => {
        setLastSavedTime(dayjs().unix());
      }}
    >
      <div className="builder slide-builder">
        <SlideBuilderToolbar />
        <div className="main-slide-builder">
          <SlideList />
          <SlideInteractiveEditor />
          <SlideEntities />
        </div>

        <div className="slide-builder-bottom">
          {`Phiên bản: ${packageMeta.version} - ${process.env.NODE_ENV}`}
          {" - "}
          {!updateDownloaded && updateProgress > 0 ? (
            <span>{`Đang tải bản cập nhật: ${updateProgress}%`}</span>
          ) : updateDownloaded ? (
            <span
              className="update-completed"
              onClick={() => {
                ipcRenderer.send(ElectronEventType.QUIT_TO_INSTALL);
              }}
            >
              Cập nhật hoàn tất, click vào đây để khởi động lại app
            </span>
          ) : null}
        </div>
      </div>
    </KeyboardEventHandler>
  );
};
