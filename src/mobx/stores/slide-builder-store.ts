import { makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";
import { dataUtils } from "~/utils/utils-data";

/**
 * Store này chứa thông tin linh tinh của slide, như ID, index đang chọn hiện thời.
 */
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

  /**
   * Đặt số đầu vào làm index của slide hiện thời.
   * @param newIndex Số đầu vào
   */
  setIndex(newIndex: number) {
    this.selectedIndex = newIndex;
  }
}
