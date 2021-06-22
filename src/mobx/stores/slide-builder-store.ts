import { makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";
import { dataUtils } from "~/utils/utils-data";

export class SlideBuilderStore {
  rootStore: RootStore;
  id = "";
  selectedIndex = -1;

  constructor(rs: RootStore) {
    this.rootStore = rs;
    this.id = dataUtils.generateUid();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  importMeta(id: string) {
    this.id = id;
  }

  setIndex(newIndex: number) {
    this.selectedIndex = newIndex;
  }
}
