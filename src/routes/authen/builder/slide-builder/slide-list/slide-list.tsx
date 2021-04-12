import React from "react";
import { useRecoilState } from "recoil";
import ScrollBar from "react-perfect-scrollbar";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";

import "react-perfect-scrollbar/dist/css/styles.css";
import "./slide-list.scss";

export const SlideList: React.FC = () => {
  const [slides] = useRecoilState(slideListState);
  const [slideBuilderMeta, setSlideBuilderMeta] = useRecoilState(slideBuilderState);

  const onClickSlide = (index: number) => {
    setSlideBuilderMeta({
      selectedIndex: index
    });
  };

  return (
    <ScrollBar id="slide-list" options={{ suppressScrollX: true }}>
      {slides.map((n, idx) => <SlideThumbnail
        onClick={(index) =>
          onClickSlide(index)}
        title={n.title} index={idx}
        inactive={slideBuilderMeta.selectedIndex !== idx}
        key={idx} />)
      }
    </ScrollBar>
  );
};
