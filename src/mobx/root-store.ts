import { SlideListStore } from "~/mobx/stores/slide-list-store";

declare const window: any;

export class RootStore {
  slideListStore: SlideListStore;

  constructor() {
    this.slideListStore = new SlideListStore(this);
  }
}

export const rootStore = new RootStore();

window._store = rootStore;
