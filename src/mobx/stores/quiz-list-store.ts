import { action, makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";
import QuizModel from "~/mobx/models/quiz";
import { QuizType } from "~/common/static-data";

export class QuizListStore {
  rootStore: RootStore;
  list: QuizModel[] = [];

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  newQuiz() {
    this.list.push(new QuizModel());
  }

  removeQuiz(id: string) {
    this.list = this.list.filter((n) => n.id !== id);
  }

  // Set the whole list
  setList(newList: QuizModel[]) {
    this.list = newList;
  }

  resetList() {
    this.list = [];
  }

  setQuizTitle = (newTitle: string) => {
    const idx = this.rootStore.quizDeckStore.selectedIndex;
    console.log(idx);
    this.list[idx].title = newTitle;
    // const qi = this.list.findIndex((n) => n.id === quizId);
    // if (qi !== -1) {
    //   this.list[qi].title = newTitle;
    // }
  };

  get getTitle() {
    // const qi = this.list.findIndex((n) => n.id === quizId);
    // if (qi !== -1) {
    //   return this.list[qi].title;
    // }
    // return "";
    return "";
  }

  setQuizType(quizId: string, newType: QuizType) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      this.list[qi].type = newType;
    }
  }
}
