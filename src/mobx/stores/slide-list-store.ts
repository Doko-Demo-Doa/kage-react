import { makeAutoObservable } from "mobx";
import { BlockSizeType, PositionType, SlideAnimationType, SlideType } from "~/typings/types";
import { RootStore } from "~/mobx/root-store";
import { AnimationType } from "~/common/static-data";
import { Delta } from "quill";
import { dataUtils } from "~/utils/utils-data";

export class SlideListStore {
  rootStore: RootStore;
  list: SlideType[] = [];
  animationCount = 0;

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  importSlideTree(l: SlideType[]) {
    this.list.length = 0;
    this.list = l;
  }

  newSlide() {
    const newSlide = {
      id: dataUtils.generateShortUid(),
      title: "",
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

  // Use async:
  // *flow() {
  //   const response = yield fetch("http://example.com/value")
  //   this.value = yield response.json()
  // }

  duplicateSlideAt(index: number) {
    const sourceSlide = this.list[index];
    if (sourceSlide) {
      const insertedItem = { ...sourceSlide };
      insertedItem.slideBlocks = insertedItem.slideBlocks.map((n) => ({
        ...n,
        id: dataUtils.generateShortUid(),
      }));
      insertedItem.id = dataUtils.generateShortUid();
      const newL = this.list.slice();
      newL.splice(index, 0, insertedItem);
      this.list = newL;
    }
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

  deleteBlock(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const newL = [...this.list];

    newL[idx].slideBlocks = newL[idx].slideBlocks.filter((n) => n.id !== blockId);
    this.list = newL;
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
      });
    } else {
      this.list[idx].animations = this.list[idx].animations.filter(
        (n) => n.id !== currentAnims[targetAnim].id
      );
    }
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

      console.log(targetBlock.bgColor);
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
