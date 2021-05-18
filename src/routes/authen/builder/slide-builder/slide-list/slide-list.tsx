import React, { useContext } from "react";
import ScrollBar from "react-perfect-scrollbar";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";
import { StoreContext } from "~/mobx/store-context";

import "./slide-list.scss";

export const SlideList: React.FC = observer(() => {
  const store = useContext(StoreContext);

  const slides = store.slideListStore.list;
  const slideBuilderMeta = store.slideBuilderStore;

  const onClickSlide = (index: number) => {
    slideBuilderMeta.setIndex(index);
  };

  const onDeleteCurrentSlide = () => {
    const currentIndex = slideBuilderMeta.selectedIndex;
    const newSlides = [...slides.slice(0, currentIndex), ...slides.slice(currentIndex + 1)];

    store.slideListStore.setList(newSlides);
  };

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down", "del"]} // Up and down
      onKeyEvent={(key) => {
        let newIndex = slideBuilderMeta.selectedIndex;
        if (key === "up" && slideBuilderMeta.selectedIndex > 0) {
          newIndex = slideBuilderMeta.selectedIndex - 1;
        } else if (key === "down" && slideBuilderMeta.selectedIndex < slides.length - 1) {
          newIndex = slideBuilderMeta.selectedIndex + 1;
        } else if (key === "del" || key === "backspace") {
          onDeleteCurrentSlide();
        }

        slideBuilderMeta.setIndex(newIndex);

        const elmnt = document.getElementById(`slide-thumb-${newIndex}`);
        elmnt?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      <ScrollBar id="slide-list" options={{ suppressScrollX: true }} tabIndex={1}>
        {slides.map((n, idx) => (
          <SlideThumbnail
            id={`slide-thumb-${idx}`}
            onClick={(index) => onClickSlide(index)}
            title={n.title}
            index={idx}
            inactive={slideBuilderMeta.selectedIndex !== idx}
            key={idx}
          />
        ))}
      </ScrollBar>
    </KeyboardEventHandler>
  );
});
