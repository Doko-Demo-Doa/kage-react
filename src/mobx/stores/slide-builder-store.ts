import { makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";

export class SlideBuilderStore {
  rootStore: RootStore;
  selectedIndex = -1;

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setIndex(newIndex: number) {
    this.selectedIndex = newIndex;
  }
}
