import React from "react";
import ScrollBar from "react-perfect-scrollbar";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";

import "react-perfect-scrollbar/dist/css/styles.css";
import "./slide-list.scss";

export const SlideList: React.FC = () => {
  return (
    <ScrollBar id="slide-list" options={{ suppressScrollX: true }}>
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
      <SlideThumbnail />
    </ScrollBar>
  );
};
