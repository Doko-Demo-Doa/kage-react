import React, { useEffect } from "react";
import { ipcRenderer } from "electron";

import { ElectronEventType } from "~/common/static-data";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";

import { platformUtils } from "~/utils/utils-platform";

import { StoreContext } from "~/mobx/store-context";
import { rootStore } from "~/mobx/root-store";

import { LoginRoute } from "~/routes/guest/login/login-route";
import { Builder } from "~/routes/authen/builder/builder";
import { PreviewRoute } from "~/routes/authen/preview/preview-route";

import "react-h5-audio-player/lib/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "antd/dist/antd.css";

import "~/app.scss";

const AppRouter = ({ children }: { children: React.ReactElement }): React.ReactElement =>
  platformUtils.isElectron() ? (
    <HashRouter>{children}</HashRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

const App = (): React.ReactElement => {
  useEffect(() => {
    ipcRenderer.send(ElectronEventType.UPDATE_CHECK, {
      provider: process.env.REACT_APP_UPDATE_PROVIDER,
      repo: process.env.REACT_APP_UPDATE_REPO,
      owner: process.env.REACT_APP_REPO_OWNER,
      private: true,
      token: process.env.REACT_APP_GH_TOKEN,
    });

    ipcRenderer.on(ElectronEventType.UPDATE_AVAILABLE, () => {
      console.log("A new update is available. Downloading now...");
    });

    return () => {
      ipcRenderer.removeAllListeners(ElectronEventType.UPDATE_AVAILABLE);
    };
  }, []);

  return (
    <StoreContext.Provider value={rootStore}>
      <AppRouter>
        <Routes>
          <Route path="/" element={<Builder />} />
          <Route path="/preview" element={<PreviewRoute />} />
          <Route path="/login" element={<LoginRoute />} />
        </Routes>
      </AppRouter>
    </StoreContext.Provider>
  );
};

export default App;
