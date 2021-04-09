import React from "react";

import { SlideBuilderToolbar } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar";

import "~/routes/authen/builder/slide-builder/slide-builder.scss";

export const SlideBuilder: React.FC = () => {
  return (
    <div className="slide-builder">
      <SlideBuilderToolbar />

      <div className="slide-builder-bottom">Bottom</div>
    </div>
  );
};
