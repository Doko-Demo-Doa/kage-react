import { makeAutoObservable } from "mobx";
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

  setQuizTitle = (quizId: string, newTitle: string) => {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      newList[qi].title = newTitle;
      this.list = newList;
    }
  };

  setQuizType(quizId: string, newType: QuizType) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      this.list[qi].type = newType;
    }
  }
}
