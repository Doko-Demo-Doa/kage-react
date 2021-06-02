import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";
import { BlankMatcher } from "~/typings/types";

// Single quiz object.
export default class QuizSelectInBlanksModel extends QuizModel {
  matchers: BlankMatcher[];

  constructor() {
    super();
    this.type = QuizType.SELECT_IN_THE_BLANKS;
    this.matchers = [];
  }
}
