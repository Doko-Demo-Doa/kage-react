import React from "react";
import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";
import { SlideList } from "~/routes/authen/builder/slide-builder/slide-list/slide-list";
import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  return (
    <div className="slide-builder">
      <SlideBuilderToolbar />
      <div>
        <SlideList />
      </div>

      <div className="slide-builder-bottom">Status</div>
    </div>
  );
};
