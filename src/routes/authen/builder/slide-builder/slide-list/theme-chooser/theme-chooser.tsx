import React, { useContext } from "react";
import ScrollBar from "react-perfect-scrollbar";
import { observer } from "mobx-react-lite";
import { fileUtils } from "~/utils/utils-files";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-list/theme-chooser/theme-chooser.scss";

// Prebuilt themes: sakura, bamboo, sky

const PREBUILT_THEMES = [
  {
    name: "Sakura",
    id: "sakura",
  },
  {
    name: "Orange",
    id: "orange",
  },
  {
    name: "Bamboo",
    id: "bamboo",
  },
];

export const ThemeChooser: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { theme, setTheme } = store.slideBuilderStore;

  return (
    <div className="theme-chooser">
      <ScrollBar>
        <div className="col1">
          {PREBUILT_THEMES.map((n) => (
            <div
              key={n.id}
              className="theme-item"
              onClick={() => setTheme(n.id)}
              style={{
                backgroundImage: `url(${fileUtils.getUsableThemeThumb(n.id)})`,
                backgroundSize: "contain",
              }}
            >
              {n.name}
            </div>
          ))}
        </div>
      </ScrollBar>

      <div className="col2">
        <div
          style={{
            backgroundImage: `url(${fileUtils.getUsableThemeBg(theme)})`,
            backgroundSize: "contain",
          }}
        />
      </div>
    </div>
  );
});
