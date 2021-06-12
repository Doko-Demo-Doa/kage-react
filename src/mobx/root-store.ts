import { autorun, configure } from "mobx";
import { SlideListStore } from "~/mobx/stores/slide-list-store";
import { QuizDeckStore } from "~/mobx/stores/quiz-deck-store";
import { SlideBuilderStore } from "~/mobx/stores/slide-builder-store";
import { QuizListStore } from "~/mobx/stores/quiz-list-store";

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

autorun(() => {
  console.log("Changed");
});
