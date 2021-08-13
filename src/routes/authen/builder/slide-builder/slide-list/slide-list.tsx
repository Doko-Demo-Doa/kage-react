import React, { useContext } from "react";
import ScrollBar from "react-perfect-scrollbar";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";
import { Container, Draggable } from "react-smooth-dnd";
import { SlideThumbnail } from "~/routes/authen/builder/slide-builder/slide-list/slide-thumbnail/slide-thumbnail";
import { StoreContext } from "~/mobx/store-context";
import { dataUtils } from "~/utils/utils-data";

import "~/routes/authen/builder/slide-builder/slide-list/slide-list.scss";

export const SlideList: React.FC = observer(() => {
  const store = useContext(StoreContext);

  const { list, duplicateSlideAt, deleteSlideAt } = store.slideListStore;
  const { setIndex, selectedIndex } = store.slideBuilderStore;

  const onClickSlide = (index: number) => {
    setIndex(index);
  };

  const onDeleteSlide = (index: number) => {
    if (selectedIndex > 0) {
      setIndex(selectedIndex - 1);
    } else if (selectedIndex <= 0) {
      setIndex(-1);
    }
    deleteSlideAt(index);
  };

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down", "del", "backspace", "clear"]} // Up and down
      onKeyEvent={(key) => {
        let newIndex = selectedIndex;
        if (key === "up" && selectedIndex > 0) {
          newIndex = selectedIndex - 1;
        } else if (key === "down" && selectedIndex < list.length - 1) {
          newIndex = selectedIndex + 1;
        } else if (key === "del" || key === "backspace") {
          onDeleteSlide(newIndex);
        }

        const elmnt = document.getElementById(`slide-thumb-${newIndex}`);
        elmnt?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
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
                onClickDuplicate={(idx) => duplicateSlideAt(idx)}
                onClickDelete={(idx) => onDeleteSlide(idx)}
                title={n?.title}
                backgroundAsset={n?.background}
                index={idx}
                inactive={selectedIndex !== idx}
                key={idx}
              />
            </Draggable>
          ))}
        </Container>
      </ScrollBar>
    </KeyboardEventHandler>
  );
});
