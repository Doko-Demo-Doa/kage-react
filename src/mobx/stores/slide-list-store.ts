import { makeAutoObservable } from "mobx";
import {
  BlockSizeType,
  PositionType,
  SlideAnimationType,
  SlideBlockType,
  SlideType,
} from "~/typings/types";
import { RootStore } from "~/mobx/root-store";
import { AnimationType, DEFAULT_TITLE_FONT_SIZE } from "~/common/static-data";
import { Delta } from "quill";
import { dataUtils } from "~/utils/utils-data";

/**
 * Store này đảm nhiệm chính đến xử lý logic của các trang slide.
 * // Use async:
 * *flow() {
 *    const response = yield fetch("http://example.com/value")
 *    this.value = yield response.json()
 *  }
 */
export class SlideListStore {
  rootStore: RootStore;
  list: SlideType[] = [];

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  importSlideTree(l: SlideType[]) {
    this.list.length = 0;
    this.list = l;
  }

  newSlide() {
    const newSlide: SlideType = {
      id: dataUtils.generateShortUid(),
      title: "",
      titleFontSize: DEFAULT_TITLE_FONT_SIZE,
      slideBlocks: [],
      animations: [],
    };

    this.list.push(newSlide);
  }

  newQuizSet(customId?: string) {
    const newSlide: SlideType = {
      id: dataUtils.generateShortUid(),
      linkedQuizId: customId || dataUtils.generateShortUid(),
      slideBlocks: [],
      animations: [],
    };

    this.list.push(newSlide);
  }

  duplicateSlideAt(index: number) {
    const sourceSlide = this.list[index];
    if (sourceSlide) {
      const insertedItem = { ...sourceSlide };

      const newBlockList: SlideBlockType[] = [];
      const newAnimList: SlideAnimationType[] = [];

      insertedItem.slideBlocks.forEach((n) => {
        const oldBlockId = n.id;
        const newBlockId = dataUtils.generateShortUid();

        // Khi đúp block thì cũng phải xử lý lại cả các animations:
        insertedItem.animations.forEach((a) => {
          if (a.blockId === oldBlockId) {
            newAnimList.push({
              ...a,
              id: dataUtils.generateShortUid(),
              blockId: newBlockId,
            });
          }
        });

        newBlockList.push({
          ...n,
          id: newBlockId,
        });
      });

      insertedItem.slideBlocks = newBlockList;
      insertedItem.animations = newAnimList;

      insertedItem.id = dataUtils.generateShortUid();
      const newL = this.list.slice();
      newL.splice(index, 0, insertedItem);
      this.list = newL;
    }
  }

  deleteSlideAt(index: number) {
    const slides = [...this.list];
    const filtered = slides.filter((n, idx) => idx !== index);
    this.list = filtered;
  }

  setList(newList: SlideType[]) {
    this.list = newList;
  }

  selectBlock(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = this.list.slice();
    newL[idx].selectedBlock = blockId;
    this.list = newL;
  }

  setTitle(newTitle: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = this.list.slice();
    newL[idx].title = newTitle;
    this.list = newL;
  }

  setTitleFontSize(newSize: number) {
    if (newSize <= 0) return;
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = this.list.slice();
    newL[idx].titleFontSize = newSize;
    this.list = newL;
  }

  setHidden(isHidden: boolean) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = this.list.slice();
    newL[idx].isHidden = isHidden;
    this.list = newL;
  }

  setBackgroundForCurrentSlide(bgFilename: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = this.list.slice();
    newL[idx].background = bgFilename;
    this.list = newL;
  }

  deleteBlock(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = [...this.list];

    const targetBlock = newL[idx].slideBlocks.find((n) => n.id === blockId);
    if (targetBlock) {
      // Xoá tất cả animation liên quan
      const currentSlide = newL[idx];
      currentSlide.animations = currentSlide.animations.filter((n) => n.blockId !== blockId);

      newL[idx].slideBlocks = newL[idx].slideBlocks.filter((n) => n.id !== blockId);
      this.list = newL;
    }
  }

  /**
   * Kích hoạt animation cho block.
   */
  toggleAnimation(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const currentAnims = this.list[idx].animations;

    const targetAnim = currentAnims.findIndex((n) => n.blockId === blockId);

    if (targetAnim === -1) {
      this.list[idx].animations.push({
        id: dataUtils.generateShortUid(),
        animationType: AnimationType.APPEAR,
        blockId,
        animationIndex: 0,
      });
    } else {
      this.list[idx].animations = this.list[idx].animations.filter(
        (n) => n.id !== currentAnims[targetAnim].id
      );
    }
  }

  setAnimationIndex(animId: string, blockId: string, animIdx: number) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const currentAnims = [...this.list[idx].animations];

    const targetAnim = currentAnims.findIndex((n) => n.blockId === blockId);

    if (targetAnim !== -1) {
      currentAnims[targetAnim].animationIndex = animIdx;
      this.list[idx].animations = currentAnims;
    }
  }

  /**
   * Dùng để bật / tắt attribute data-autoplay của thẻ video/audio. Hiện chỉ dùng cho 1 case duy nhất.
   * Là cho audio được phát ngay khi vào trang slide.
   * Lúc này animationIndex sẽ luôn là 0.
   * @param blockId Id của block chỉ định.
   */
  toggleMediaAutoplay(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const currentAnims = [...this.list[idx].animations];

    const targetAnim = currentAnims.findIndex((n) => n.blockId === blockId);

    if (targetAnim !== -1) {
      currentAnims[targetAnim].mediaAutoplay = !currentAnims[targetAnim].mediaAutoplay;
      this.list[idx].animations = currentAnims;
    }
  }

  toggleBlockVisibility(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const targetBlock = this.list[idx].slideBlocks.find((n) => n.id === blockId);

    if (targetBlock) {
      targetBlock.isHidden = !targetBlock.isHidden;
    }
  }

  setBlockList(newBlocks: SlideBlockType[]) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;

    this.list[idx].slideBlocks = newBlocks;
  }

  setAnimationList(newAnims: SlideAnimationType[]) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;

    this.list[idx].animations = newAnims;
  }

  // Block modificators:
  modifyTextBlock(blockId: string, newText: Delta | undefined) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const targetBlock = this.list[idx].slideBlocks.find((n) => n.id === blockId);

    if (targetBlock) {
      targetBlock.deltaContent = newText;
    }
  }

  resizeBlock(blockId: string, newPosition: PositionType, newSize: BlockSizeType) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const targetBlock = this.list[idx].slideBlocks.find((n) => n.id === blockId);

    if (targetBlock) {
      targetBlock.position = newPosition;
      targetBlock.size = newSize;
    }
  }

  setBlockBgColor(blockId: string, newColor?: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const targetBlock = this.list[idx].slideBlocks.find((n) => n.id === blockId);

    if (targetBlock) {
      targetBlock.bgColor = newColor;
    }
  }

  dragBlock(blockId: string, newPosition: PositionType) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const targetBlock = this.list[idx].slideBlocks.find((n) => n.id === blockId);

    if (targetBlock) {
      targetBlock.position = newPosition;
    }
  }

  dragAnchor(blockId: string, newAnchor: PositionType) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const targetBlock = this.list[idx].slideBlocks.find((n) => n.id === blockId);

    if (targetBlock) {
      targetBlock.anchor = newAnchor;
    }
  }
}
