import { useRecoilState } from "recoil";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { SlideBlock } from "./slide-block-v2/slide-block-v2";

import "react-quill/dist/quill.snow.css";
import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2.scss";

export const SlideInteractiveEditor: React.FC = () => {
  const [slideList, setSlideList] = useRecoilState(slideListState);
  const [slideBuilderMeta] = useRecoilState(slideBuilderState);

  const slideTitle = slideList[slideBuilderMeta.selectedIndex]?.title;

  const selectBlock = (slideIndex: number, blockId: string) => {
    const newSlideArray = [...slideList];
    const activeSlide = { ...newSlideArray[slideIndex] };
    activeSlide.selectedBlock = blockId;
    newSlideArray[slideIndex] = activeSlide;

    setSlideList([...newSlideArray]);
  };

  // Nếu lỗi thì bỏ hết những children trong Layer.
  return (
    <>
      <div id="slide-interactive-editor">
        <div id="editor-container" />
        <h2>{slideTitle}</h2>

        {slideList[slideBuilderMeta.selectedIndex]?.slideBlocks.map((n, i) => {
          return (
            <SlideBlock
              key={i}
              {...n}
              onSelect={(blockId) => {
                selectBlock(slideBuilderMeta.selectedIndex, blockId);
              }}
            />
          );
        })}
      </div>
    </>
  );
};
