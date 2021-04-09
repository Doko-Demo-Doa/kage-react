import React from "react";
import { useRecoilState } from "recoil";
import ScrollBar from "react-perfect-scrollbar";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";
import { slideListState } from "~/atoms/slide-list-atom";

import "react-perfect-scrollbar/dist/css/styles.css";
import "./slide-list.scss";

export const SlideList: React.FC = () => {
  const [slideList] = useRecoilState(slideListState);

  return (
    <ScrollBar id="slide-list" options={{ suppressScrollX: true }}>
      {slideList.map((n, idx) => <SlideThumbnail title={n.title} index={idx} key={idx} />)}
    </ScrollBar>
  );
};
