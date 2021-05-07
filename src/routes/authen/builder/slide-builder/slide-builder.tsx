import React from "react";
import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";
import { SlideList } from "~/routes/authen/builder/slide-builder/slide-list/slide-list";
import { SlideInteractiveEditor } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2";
import { SlideEntities } from "~/routes/authen/builder/slide-builder/slide-entities/slide-entities";

import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  return (
    <div className="builder slide-builder">
      <SlideBuilderToolbar />
      <div className="main-slide-builder">
        <SlideList />
        <SlideInteractiveEditor />
        <SlideEntities />
      </div>

      <div className="slide-builder-bottom">Status</div>
    </div>
  );
};
