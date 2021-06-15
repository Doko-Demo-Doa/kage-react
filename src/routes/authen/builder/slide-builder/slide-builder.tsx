import React, { useEffect } from "react";
import { ipcRenderer } from "electron";
import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";
import { SlideList } from "~/routes/authen/builder/slide-builder/slide-list/slide-list";
import { SlideInteractiveEditor } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2";
import { SlideEntities } from "~/routes/authen/builder/slide-builder/slide-entities/slide-entities";

import packageMeta from "../../../../../package.json";

import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  useEffect(() => {
    ipcRenderer.on("update_available", () => {
      console.log("A new update is available. Downloading now...");
    });

    ipcRenderer.on("update_downloaded", () => {
      console.log("Update Downloaded. It will be installed on restart. Restart now?");
    });

    return () => {
      ipcRenderer.removeAllListeners("update_available");
      ipcRenderer.removeAllListeners("update_downloaded");
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
