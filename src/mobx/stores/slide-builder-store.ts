import { makeAutoObservable } from "mobx";
import { DEFAULT_THEME } from "~/common/config";
import { RootStore } from "~/mobx/root-store";
import { dataUtils } from "~/utils/utils-data";

export class SlideBuilderStore {
  rootStore: RootStore;
  id = "";
  theme = DEFAULT_THEME;
  selectedIndex = -1;

  constructor(rs: RootStore) {
    this.rootStore = rs;
    this.id = dataUtils.generateUid();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  importMeta(id: string) {
    this.id = id;
  }

  /**
   * Đặt số đầu vào làm index của slide hiện thời.
   * @param newIndex Số đầu vào
   */
  setIndex(newIndex: number) {
    this.selectedIndex = newIndex;
  }

  setTheme(newTheme: string) {
    this.theme = newTheme;
  }
}
