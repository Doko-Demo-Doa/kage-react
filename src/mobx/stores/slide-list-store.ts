import { makeAutoObservable } from "mobx";
import dayjs from "dayjs";
import { BlockSizeType, PositionType, SlideType } from "~/typings/types";
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

  newSlide() {
    const newSlide = {
      title: "",
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

  setList(newList: SlideType[]) {
    this.list = newList;
  }

  selectBlock(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    this.list[idx].selectedBlock = blockId;
  }

  setTitle(newTitle: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    this.list[idx].title = newTitle;
  }

  toggleAnimation(blockId: string) {
    const idx = this.rootStore.slideBuilderStore.selectedIndex;
    const currentAnims = this.list[idx].animations;

    const targetAnim = currentAnims.findIndex((n) => n.blockId === blockId);

    if (targetAnim === -1) {
      this.list[idx].animations.push({
        id: dayjs().unix().toString(),
        animationType: AnimationType.APPEAR,
        blockId,
      });
    }
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
