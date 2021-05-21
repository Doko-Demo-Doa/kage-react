import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";

type Choice = {
  id: string;
  label: string;
};

// Single quiz object.
export default class QuizSelectInBlanksModel extends QuizModel {
  audioLink?: string;
  imageVideoLink?: string;
  matchers: Choice[];

  constructor() {
    super();
    this.type = QuizType.SELECT_IN_THE_BLANKS;
    this.matchers = [];
  }
}
