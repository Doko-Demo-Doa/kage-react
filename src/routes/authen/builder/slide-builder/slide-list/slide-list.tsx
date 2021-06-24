import React, { useContext } from "react";
import { Button, Popover } from "antd";
import ScrollBar from "react-perfect-scrollbar";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";
import { Container, Draggable } from "react-smooth-dnd";
import { ThemeChooser } from "~/routes/authen/builder/slide-builder/slide-list/theme-chooser/theme-chooser";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";
import { StoreContext } from "~/mobx/store-context";
import { dataUtils } from "~/utils/utils-data";

import "~/routes/authen/builder/slide-builder/slide-list/slide-list.scss";

export const SlideList: React.FC = observer(() => {
  const store = useContext(StoreContext);

  const { list, duplicateSlideAt } = store.slideListStore;
  const slideBuilderMeta = store.slideBuilderStore;

  const onClickSlide = (index: number) => {
    slideBuilderMeta.setIndex(index);
  };

  const onDeleteCurrentSlide = () => {
    const currentIndex = slideBuilderMeta.selectedIndex;

    if (list.length > 1 && currentIndex !== 0) {
      slideBuilderMeta.setIndex(currentIndex - 1);
    }
    const newSlides = [...list.slice(0, currentIndex), ...list.slice(currentIndex + 1)];

    store.slideListStore.setList(newSlides);
  };

  const onDuplicateSlide = (index: number) => {
    duplicateSlideAt(index);
  };

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down", "del", "backspace", "clear"]} // Up and down
      onKeyEvent={(key) => {
        let newIndex = slideBuilderMeta.selectedIndex;
        if (key === "up" && slideBuilderMeta.selectedIndex > 0) {
          newIndex = slideBuilderMeta.selectedIndex - 1;
        } else if (key === "down" && slideBuilderMeta.selectedIndex < list.length - 1) {
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
      <Popover content={<ThemeChooser />} placement="rightTop" trigger="click">
        <Button className="theme-chooser-btn">Giao diện tuỳ chỉnh</Button>
      </Popover>
      <ScrollBar id="slide-list" options={{ suppressScrollX: true }} tabIndex={1}>
        <Container
          onDrop={(e) => {
            store.slideListStore.setList(dataUtils.createSortedList(list, e));
            e.addedIndex && onClickSlide(e.addedIndex);
          }}
        >
          {list.map((n, idx) => (
            <Draggable key={n.id}>
              <SlideThumbnail
                id={n.id}
                linkedQuizId={n.linkedQuizId}
                onClick={(index) => onClickSlide(index)}
                onClickDuplicate={(idx) => onDuplicateSlide(idx)}
                title={n?.title}
                index={idx}
                inactive={slideBuilderMeta.selectedIndex !== idx}
                key={idx}
              />
            </Draggable>
          ))}
        </Container>
      </ScrollBar>
    </KeyboardEventHandler>
  );
});
