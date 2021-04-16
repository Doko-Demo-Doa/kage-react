import React from "react";
import { useRecoilState } from "recoil";
import ScrollBar from "react-perfect-scrollbar";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";

import "./slide-list.scss";

export const SlideList: React.FC = () => {
  const [slides, setSlides] = useRecoilState(slideListState);
  const [slideBuilderMeta, setSlideBuilderMeta] = useRecoilState(slideBuilderState);

  const onClickSlide = (index: number) => {
    setSlideBuilderMeta({
      selectedIndex: index
    });
  };

  const onDeleteCurrentSlide = () => {
    const currentIndex = slideBuilderMeta.selectedIndex;

    const newSlides = [...slides.slice(0, currentIndex), ...slides.slice(currentIndex + 1)];

    setSlides(newSlides);
    setSlideBuilderMeta({
      selectedIndex: currentIndex - 1
    });
  };

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down", "del"]} // Up and down
      onKeyEvent={(key) => {
        let newIndex = slideBuilderMeta.selectedIndex;
        if (key === "up" && (slideBuilderMeta.selectedIndex > 0)) {
          newIndex = slideBuilderMeta.selectedIndex - 1;
        } else if (key === "down" && (slideBuilderMeta.selectedIndex < slides.length - 1)) {
          newIndex = slideBuilderMeta.selectedIndex + 1;
        } else if (key === "del") {
          onDeleteCurrentSlide();
        }

        setSlideBuilderMeta({
          selectedIndex: newIndex
        });

        const elmnt = document.getElementById(`slide-thumb-${newIndex}`);
        elmnt?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}>
      <ScrollBar id="slide-list" options={{ suppressScrollX: true }} tabIndex={1}>
        {slides.map((n, idx) => (
          <SlideThumbnail
            id={`slide-thumb-${idx}`}
            onClick={(index) =>
              onClickSlide(index)}
            title={n.title} index={idx}
            inactive={slideBuilderMeta.selectedIndex !== idx}
            key={idx} />
        ))
        }
      </ScrollBar>
    </KeyboardEventHandler>
  );
};
