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
  currentWorkingFile = ""; // Path đến file zip / dsa / dst đang làm việc, dùng cho chức năng save/autosave.
  lastSavedTimestamp = 0;

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

  setCurrentWorkingFile(filePath: string) {
    this.currentWorkingFile = filePath;
  }

  // Cần có mốc thời gian để biết được lần cuối save là khi nào. Reset lại khi mở file mới.
  setLastSavedTime(newUnixTimestamp: number) {
    this.lastSavedTimestamp = newUnixTimestamp;
  }
}
