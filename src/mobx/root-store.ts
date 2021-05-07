import { SlideListStore } from "~/mobx/stores/slide-list-store";
import { QuizDeckStore } from "~/mobx/stores/quiz-deck-store";

declare const window: any;

export class RootStore {
  slideListStore: SlideListStore;
  quizDeckStore: QuizDeckStore;

  constructor() {
    this.slideListStore = new SlideListStore(this);
    this.quizDeckStore = new QuizDeckStore(this);
  }
}

export const rootStore = new RootStore();

window._store = rootStore;
