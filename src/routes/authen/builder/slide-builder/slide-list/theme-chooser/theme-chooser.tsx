import React, { useContext, useState } from "react";
import { Input } from "antd";
import ScrollBar from "react-perfect-scrollbar";
import { observer } from "mobx-react-lite";
import { fileUtils } from "~/utils/utils-files";
import { formattingUtils } from "~/utils/utils-formatting";
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
  const [previewing, setPreviewing] = useState("sakura");
  const [previewText, setPreviewText] = useState("");

  const store = useContext(StoreContext);
  const { setTheme } = store.slideBuilderStore;

  return (
    <div className="theme-chooser">
      <ScrollBar>
        <div className="col1">
          {PREBUILT_THEMES.map((n) => (
            <div
              key={n.id}
              className="theme-item"
              onClick={() => setTheme(n.id)}
              onMouseEnter={() => setPreviewing(n.id)}
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
          className="preview"
          style={{
            backgroundImage: `url(${fileUtils.getUsableThemeBg(previewing)})`,
          }}
        >
          <div className="preview-text">{formattingUtils.htmlToJSX(previewText)}</div>
        </div>
        <br />
        <Input
          placeholder="Gõ để xem thử"
          maxLength={20}
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
        />
      </div>
    </div>
  );
});
