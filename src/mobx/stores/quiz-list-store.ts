import { makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";
import QuizModel from "~/mobx/models/quiz";
import { QuizType } from "~/common/static-data";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import { dataUtils } from "~/utils/utils-data";

export class QuizListStore {
  rootStore: RootStore;
  list: QuizModel[] = [];

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  newQuiz() {
    const newQuiz = new QuizSingleChoiceModel();
    newQuiz.choices = [
      { id: dataUtils.generateUid(), label: "Lựa chọn 1" },
      { id: dataUtils.generateUid(), label: "Lựa chọn 2" },
    ];

    this.list.push(newQuiz);
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
      const newList = this.list.slice();
      newList[qi].type = newType;
      this.list = newList;
    }
  }

  // Only for single choice
  setSingleCorrectChoice(quizId: string, correctChoiceIndex: number) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      if (newList[qi].type !== QuizType.SINGLE_CHOICE) return;
      const target = newList[qi] as QuizSingleChoiceModel;
      target.correctIndex = correctChoiceIndex;
      newList[qi] = target;
      this.list = newList;
    }
  }

  addNewChoice(quizId: string) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();

      if (newList[qi].type !== QuizType.SINGLE_CHOICE) return;
      const target = newList[qi] as QuizSingleChoiceModel;
      target.choices.push({ id: dataUtils.generateUid(), label: "" });
      newList[qi] = target;
      this.list = newList;
    }
  }

  editChoiceLabel(quizId: string, choiceIndex: number, newlabel: string) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      if (newList[qi].type !== QuizType.SINGLE_CHOICE) return;
      const target = newList[qi] as QuizSingleChoiceModel;
      target.choices[choiceIndex].label = newlabel;
      newList[qi] = target;
      this.list = newList;
    }
  }

  removeChoice(quizId: string, choiceIndex: number) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();

      if (newList[qi].type !== QuizType.SINGLE_CHOICE) return;
      const target = newList[qi] as QuizSingleChoiceModel;
      target.choices.splice(choiceIndex, 1);
      newList[qi] = target;
      this.list = newList;
    }
  }
}
