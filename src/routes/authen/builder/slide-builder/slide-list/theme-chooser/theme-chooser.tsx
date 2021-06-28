import React from "react";
import ScrollBar from "react-perfect-scrollbar";

import "~/routes/authen/builder/slide-builder/slide-list/theme-chooser/theme-chooser.scss";
import { fileUtils } from "~/utils/utils-files";

// Prebuilt themes: sakura, bamboo, sky

const PREBUILT_THEMES = [
  {
    name: "Sakura",
    id: "sakura",
  },
  {
    name: "Bamboo",
    id: "bamboo",
  },
  {
    name: "Skylake",
    id: "sky",
  },
];

export const ThemeChooser: React.FC = () => {
  return (
    <div className="theme-chooser">
      <ScrollBar>
        <div className="col1">
          {PREBUILT_THEMES.map((n) => (
            <div
              key={n.id}
              className="theme-item"
              style={{
                backgroundImage: `url(${fileUtils.getUsableThemeThumb("sakura")})`,
              }}
            >
              {n.name}
            </div>
          ))}
        </div>
      </ScrollBar>

      <div className="col2">Chức năng đang hoàn thiện</div>
    </div>
  );
};
