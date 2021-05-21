import { makeAutoObservable } from "mobx";
import { uniq } from "rambdax";
import { RootStore } from "~/mobx/root-store";
import QuizModel from "~/mobx/models/quiz";
import { QuizType } from "~/common/static-data";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import { dataUtils } from "~/utils/utils-data";
import QuizMultipleChoicesModel from "../models/quiz-multiple-choices";

export class QuizListStore {
  rootStore: RootStore;
  list: QuizModel[] = [];

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  newQuiz() {
    const newQuiz = new QuizSingleChoiceModel();

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

  // All
  setQuizType(quizId: string, newType: QuizType) {
    const qi = this.list.findIndex((n) => n.id === quizId);

    if (qi !== -1) {
      const newList = this.list.slice();
      let n = new QuizModel();

      if (newType === QuizType.SINGLE_CHOICE) {
        n = new QuizSingleChoiceModel();
      } else if (newType === QuizType.MULTIPLE_CHOICES) {
        n = new QuizMultipleChoicesModel();
      } else {
        n = new QuizSingleChoiceModel();
      }
      newList[qi] = n;

      this.list = newList;
    }
  }

  /**
   * Multiple choices
   */
  setMultipleCorrectChoice(quizId: string, choiceId: string, isCorrect: boolean) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      if (newList[qi].type !== QuizType.MULTIPLE_CHOICES) return;
      const target = newList[qi] as QuizMultipleChoicesModel;
      const corrects = isCorrect
        ? uniq([...target.correctIds, choiceId])
        : target.correctIds.filter((n) => n !== choiceId);
      target.correctIds = [...corrects];
      newList[qi] = target;
      this.list = newList;
    }
  }

  /**
   * Single choice
   */
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
  /**
   * Single choice
   * Multiple choices
   */
  addNewChoice(quizId: string) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      console.log(newList[qi].type);

      if (
        newList[qi].type !== QuizType.SINGLE_CHOICE &&
        newList[qi].type !== QuizType.MULTIPLE_CHOICES
      )
        return;
      const target = newList[qi] as QuizSingleChoiceModel | QuizMultipleChoicesModel;
      target.choices.push({ id: dataUtils.generateShortUid(), label: "" });
      newList[qi] = target;
      this.list = newList;
    }
  }
  /**
   * Single choice
   * Multiple choices
   */
  editChoiceLabel(quizId: string, choiceIndex: number, newlabel: string) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      if (
        newList[qi].type !== QuizType.SINGLE_CHOICE &&
        newList[qi].type !== QuizType.MULTIPLE_CHOICES
      )
        return;
      const target = newList[qi] as QuizSingleChoiceModel | QuizMultipleChoicesModel;
      target.choices[choiceIndex].label = newlabel;
      newList[qi] = target;
      this.list = newList;
    }
  }
  /**
   * Single choice
   * Multiple choices
   */
  removeChoice(quizId: string, choiceIndex: number) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();

      if (
        newList[qi].type !== QuizType.SINGLE_CHOICE &&
        newList[qi].type !== QuizType.MULTIPLE_CHOICES
      )
        return;
      const target = newList[qi] as QuizSingleChoiceModel | QuizMultipleChoicesModel;
      target.choices.splice(choiceIndex, 1);
      newList[qi] = target;
      this.list = newList;
    }
  }
}
