import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { ElectronEventType } from "~/common/static-data";

import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";
import { SlideList } from "~/routes/authen/builder/slide-builder/slide-list/slide-list";
import { SlideInteractiveEditor } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2";
import { SlideEntities } from "~/routes/authen/builder/slide-builder/slide-entities/slide-entities";

import packageMeta from "../../../../../package.json";

import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    ipcRenderer.on(ElectronEventType.DOWNLOAD_PROGRESS, (event, percent: number) => {
      setUpdateProgress(percent);
    });

    ipcRenderer.on(ElectronEventType.UPDATE_DOWNLOADED, () => {
      setUpdateDownloaded(true);
    });

    return () => {
      ipcRenderer.removeAllListeners(ElectronEventType.DOWNLOAD_PROGRESS);
      ipcRenderer.removeAllListeners(ElectronEventType.UPDATE_DOWNLOADED);
    };
  }, []);

  return (
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
  );
};
