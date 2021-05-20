import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";

type Choice = {
  id: string;
  label: string;
};

// Single quiz object.
export default class QuizSingleChoiceModel extends QuizModel {
  audioLink?: string;
  imageVideoLink?: string;
  correctIndex: number;
  choices: Choice[];

  constructor() {
    super();
    this.type = QuizType.SINGLE_CHOICE;
    this.correctIndex = 0;
    this.choices = [];
  }
}
