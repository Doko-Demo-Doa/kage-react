import { makeAutoObservable } from "mobx";
import { uniq } from "rambdax";
import dayjs from "dayjs";
import { RootStore } from "~/mobx/root-store";
import QuizModel from "~/mobx/models/quiz";
import { QuizType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";

import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import QuizMultipleChoicesModel from "~/mobx/models/quiz-multiple-choices";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";

export class QuizListStore {
  rootStore: RootStore;
  list: QuizModel[] = [];

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  newQuiz() {
    const newQuiz = new QuizSelectInBlanksModel();

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

  // All
  setQuizTitle = (quizId: string, newTitle: string) => {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      newList[qi].title = newTitle;
      this.list = newList;
    }
  };

  // All
  setQuizAudio = (quizId: string, mediaName: string) => {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      newList[qi].audioLink = mediaName;
      this.list = newList;
    }
  };

  setQuizImage = (quizId: string, mediaName: string) => {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      newList[qi].imageLink = mediaName;
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

  setCountdown(quizId: string, newCountdown: number) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice();
      const target = newList[qi] as QuizSingleChoiceModel;
      target.countdown = newCountdown;
      newList[qi] = target;
      this.list = newList;
    }
  }

  toggleAutoAudit(quizId: string, isAutoAudit: boolean) {
    const qi = this.list.findIndex((n) => n.id === quizId);

    if (qi !== -1) {
      const newList = this.list.slice();
      newList[qi].autoAudit = isAutoAudit;

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

  // - Select in blanks
  setQuizContent = (quizId: string, newNote: string) => {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice() as QuizSelectInBlanksModel[];
      newList[qi].content = newNote;

      const rxp = /\[(.*?)\]/g;
      const newMatchers = newNote.match(rxp) || [];
      newList[qi].matchers = newMatchers.map((subToken) => ({
        id: subToken.replace("[", "").replace("]", ""),
        correctChoice: "",
        label: "",
        choices: dataUtils.generateInitQuizChoices(),
      }));
      this.list = newList;
    }
  };

  // - Select in blanks
  // Thêm 1 ô quiz trong dòng câu.
  addNewSelectInBlankDropdown(quizId: string) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice() as QuizSelectInBlanksModel[];
      newList[qi].content += `[${dayjs().unix()}]`;

      const rxp = /\[(.*?)\]/g;
      const newMatchers = newList[qi].content?.match(rxp) || [];
      newList[qi].matchers = newMatchers.map((subToken) => ({
        id: subToken.replace("[", "").replace("]", ""),
        correctChoice: "",
        label: "",
        choices: dataUtils.generateInitQuizChoices(),
      }));

      this.list = newList;
    }
  }

  /**
   * - Select in blanks
   */
  addNewOptionInDropdown(quizId: string, matcherId: string | undefined) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice() as QuizSelectInBlanksModel[];
      const matcherIndex = newList[qi].matchers.findIndex((n) => n.id === matcherId);
      if (matcherIndex !== -1) {
        newList[qi].matchers[matcherIndex].choices.push({
          id: dayjs().unix().toString(),
          label: "",
        });
      }

      this.list = newList;
    }
  }

  /**
   * - Select in blanks
   * Choose correct choice in matcher
   */
  chooseCorrectMatcher(quizId: string, matcherId: string | undefined, choiceId: string) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice() as QuizSelectInBlanksModel[];
      const matcherIndex = newList[qi].matchers.findIndex((n) => n.id === matcherId);
      if (matcherIndex !== -1) {
        newList[qi].matchers[matcherIndex].correctChoice = choiceId;
      }

      this.list = newList;
    }
  }

  /**
   * - Select in blanks
   */
  changeChoiceLabel(
    quizId: string,
    matcherId: string | undefined,
    choiceId: string,
    newLabel: string
  ) {
    const qi = this.list.findIndex((n) => n.id === quizId);
    if (qi !== -1) {
      const newList = this.list.slice() as QuizSelectInBlanksModel[];
      const matcherIndex = newList[qi].matchers.findIndex((n) => n.id === matcherId);
      if (matcherIndex !== -1) {
        const choiceIndex = newList[qi].matchers[matcherIndex].choices.findIndex(
          (n) => n.id === choiceId
        );
        if (choiceIndex !== -1) {
          newList[qi].matchers[matcherIndex].choices[choiceIndex].label = newLabel;
        }
      }

      this.list = newList;
      console.log(this.list);
    }
  }
}
