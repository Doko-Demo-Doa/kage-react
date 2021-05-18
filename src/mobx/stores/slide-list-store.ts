import { makeAutoObservable } from "mobx";
import dayjs from "dayjs";
import { SlideType } from "~/typings/types";
import { RootStore } from "~/mobx/root-store";
import { AnimationType } from "~/common/static-data";

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
}
