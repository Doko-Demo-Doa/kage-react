import React, { useEffect } from "react";
import { ipcRenderer } from "electron";

import { ElectronEventType } from "~/common/static-data";

import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";
import { SlideList } from "~/routes/authen/builder/slide-builder/slide-list/slide-list";
import { SlideInteractiveEditor } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2";
import { SlideEntities } from "~/routes/authen/builder/slide-builder/slide-entities/slide-entities";

import packageMeta from "../../../../../package.json";

import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  useEffect(() => {
    ipcRenderer.send(ElectronEventType.UPDATE_CHECK, {
      provider: process.env.REACT_APP_UPDATE_PROVIDER,
      repo: process.env.REACT_APP_UPDATE_REPO,
      owner: process.env.REACT_APP_REPO_OWNER,
      private: true,
      token: process.env.REACT_APP_GH_TOKEN,
    });

    ipcRenderer.on(ElectronEventType.UPDATE_NOT_AVAILABLE, (event, data) => {
      console.log("Khong co update", data);
    });

    ipcRenderer.on(ElectronEventType.UPDATE_AVAILABLE, (_, data) => {
      console.log("A new update is available. Downloading now...", data);
    });

    ipcRenderer.on(ElectronEventType.UPDATE_DOWNLOADED, (_, data) => {
      console.log("Update downloaded", data);
    });

    return () => {
      ipcRenderer.removeAllListeners(ElectronEventType.UPDATE_AVAILABLE);
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

      <div className="slide-builder-bottom">{`Phiên bản: ${packageMeta.version} - ${process.env.NODE_ENV}`}</div>
    </div>
  );
};
