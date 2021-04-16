import { useRef } from "react";
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { useRecoilState } from "recoil";
import { MinimumCanvasSize } from "~/common/static-data";
import { SlideBlock } from "~/routes/authen/builder/slide-builder/slide-interactive-editor/slide-block/slide-block";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";

import "react-quill/dist/quill.snow.css";
import "~/routes/authen/builder/slide-builder/slide-interactive-editor/slide-interactive-editor.scss";

export const SlideInteractiveEditor: React.FC = () => {
  const layerRef = useRef<Konva.Layer>(null);

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

        <Stage width={MinimumCanvasSize.WIDTH} height={MinimumCanvasSize.HEIGHT}>
          <Layer ref={layerRef}>
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
          </Layer>
        </Stage>
      </div>
    </>
  );
};
