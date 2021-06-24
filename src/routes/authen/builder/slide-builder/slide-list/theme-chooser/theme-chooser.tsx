import React from "react";
import ScrollBar from "react-perfect-scrollbar";

import "~/routes/authen/builder/slide-builder/slide-list/theme-chooser/theme-chooser.scss";

export const ThemeChooser: React.FC = () => {
  return (
    <div className="theme-chooser">
      <ScrollBar>
        <div className="col1">
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
          <div className="theme-item">Theme</div>
        </div>
      </ScrollBar>

      <div className="col2">Chức năng đang hoàn thiện</div>
    </div>
  );
};
