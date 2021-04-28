import { useRecoilState } from "recoil";
import { Delta } from "quill";
import dayjs from "dayjs";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { BlockSizeType, PositionType, SlideType } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";
import { SlideBlock } from "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-block-v2/slide-block-v2";

import "~/routes/authen/builder/slide-builder/slide-interactive-editor-v2/slide-interactive-editor-v2.scss";
import { AnimationType } from "~/common/static-data";

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

  const modifyTextBlock = (blockId: string, newText: Delta | undefined) => {
    const newSlideArray: SlideType[] = dataUtils.convertToMutableData(slideList);
    const slideIndex = slideBuilderMeta.selectedIndex;
    const activeSlide = newSlideArray[slideIndex];

    const targetBlock = activeSlide.slideBlocks.findIndex((n) => n.id === blockId);

    if (targetBlock !== -1) {
      const blk = activeSlide.slideBlocks[targetBlock];
      blk.deltaContent = newText;

      activeSlide.slideBlocks[targetBlock] = { ...blk };
      newSlideArray[slideIndex] = activeSlide;

      setSlideList(newSlideArray);
    }
  };

  const dispatchResizeBlock = (
    blockId: string,
    newPosition: PositionType,
    newSize: BlockSizeType
  ) => {
    const newSlideArray: SlideType[] = dataUtils.convertToMutableData(slideList);
    const slideIndex = slideBuilderMeta.selectedIndex;
    const activeSlide = newSlideArray[slideIndex];

    const targetBlock = activeSlide.slideBlocks.findIndex((n) => n.id === blockId);

    if (targetBlock !== -1) {
      const blk = { ...activeSlide.slideBlocks[targetBlock] };
      blk.size = newSize;
      blk.position = newPosition;

      activeSlide.slideBlocks[targetBlock] = { ...blk };
      newSlideArray[slideIndex] = activeSlide;

      setSlideList(newSlideArray);
    }
  };

  const dispatchDragBlock = (blockId: string, newPosition: PositionType) => {
    const newSlideArray: SlideType[] = dataUtils.convertToMutableData(slideList);
    const slideIndex = slideBuilderMeta.selectedIndex;
    const activeSlide = newSlideArray[slideIndex];

    const targetBlock = activeSlide.slideBlocks.findIndex((n) => n.id === blockId);

    if (targetBlock !== -1) {
      const blk = { ...activeSlide.slideBlocks[targetBlock] };
      blk.position = newPosition;

      activeSlide.slideBlocks[targetBlock] = blk;
      newSlideArray[slideIndex] = activeSlide;

      setSlideList(newSlideArray);
    }
  };

  const onToggleAnimation = (blockId: string) => {
    const newSlideArray: SlideType[] = dataUtils.convertToMutableData(slideList);
    const slideIndex = slideBuilderMeta.selectedIndex;
    const activeSlide = newSlideArray[slideIndex];

    const targetAnim = activeSlide.animations.findIndex((n) => n.blockId === blockId);

    if (targetAnim === -1) {
      activeSlide.animations.push({
        id: dayjs().unix().toString(),
        animationType: AnimationType.APPEAR,
        blockId,
      });
      newSlideArray[slideIndex] = activeSlide;

      console.log(newSlideArray);

      setSlideList(newSlideArray);
    }
  };

  // Nếu lỗi thì bỏ hết những children trong Layer.
  return (
    <>
      <div id="slide-interactive-editor">
        <h2 className="slide-title">{slideTitle}</h2>

        {slideList[slideBuilderMeta.selectedIndex]?.slideBlocks.map((n, i) => {
          return (
            <SlideBlock
              key={i}
              {...n}
              selected={n.id === slideList[slideBuilderMeta.selectedIndex]?.selectedBlock}
              onSelect={(blockId) => {
                selectBlock(slideBuilderMeta.selectedIndex, blockId);
              }}
              onDrag={(blockId, pos) => {
                dispatchDragBlock(blockId, pos);
              }}
              onResized={(blockId, pos, size) => {
                dispatchResizeBlock(blockId, pos, size);
              }}
              onTextChanged={(blockId, newText) => {
                modifyTextBlock(blockId, newText);
              }}
              onToggleAnimation={(blockId) => {
                onToggleAnimation(blockId);
              }}
            />
          );
        })}
      </div>
    </>
  );
};
