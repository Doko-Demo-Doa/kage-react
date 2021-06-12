import { autorun, configure } from "mobx";
import { SlideListStore } from "~/mobx/stores/slide-list-store";
import { QuizDeckStore } from "~/mobx/stores/quiz-deck-store";
import { SlideBuilderStore } from "~/mobx/stores/slide-builder-store";
import { QuizListStore } from "~/mobx/stores/quiz-list-store";
import { fileUtils } from "~/utils/utils-files";
import { commonHelper } from "~/common/helper";

configure({
  enforceActions: "never",
});

export class RootStore {
  slideBuilderStore: SlideBuilderStore;
  slideListStore: SlideListStore;

  quizDeckStore: QuizDeckStore;
  quizListStore: QuizListStore;

  constructor() {
    this.slideBuilderStore = new SlideBuilderStore(this);
    this.slideListStore = new SlideListStore(this);
    this.quizDeckStore = new QuizDeckStore(this);
    this.quizListStore = new QuizListStore(this);
  }
}

export const rootStore = new RootStore();

/**
 * Lắng nghe thay đổi và ghi vào file manifest khi:
 * - Length của slide list thay đổi
 * Theo chu kì
 */
autorun(() => {
  const d = commonHelper.prepareExportData(rootStore.slideListStore.list);
  fileUtils.saveSlideJsonToCache(d);
});
