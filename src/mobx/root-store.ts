import { SlideListStore } from "~/mobx/stores/slide-list-store";
import { QuizDeckStore } from "~/mobx/stores/quiz-deck-store";
import { SlideBuilderStore } from "./stores/slide-builder-store";

export class RootStore {
  slideBuilderStore: SlideBuilderStore;
  slideListStore: SlideListStore;
  quizDeckStore: QuizDeckStore;

  constructor() {
    this.slideBuilderStore = new SlideBuilderStore(this);
    this.slideListStore = new SlideListStore(this);
    this.quizDeckStore = new QuizDeckStore(this);
  }
}

export const rootStore = new RootStore();
