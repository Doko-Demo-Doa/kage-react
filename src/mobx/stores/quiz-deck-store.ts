import { makeAutoObservable, observable, action } from "mobx";
import { RootStore } from "~/mobx/root-store";
import QuizModel from "~/mobx/models/quiz";

export class QuizDeckStore {
  rootStore: RootStore;
  list: QuizModel[] = [];

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {
      list: observable,
      newQuiz: action,
      setList: action,
    });
  }

  newQuiz() {
    this.list.push(new QuizModel());
  }

  // Set the whole list
  setList(newList: QuizModel[]) {
    this.list = newList;
  }

  resetList() {
    this.list = [];
  }
}