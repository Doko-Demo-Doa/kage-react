import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";
import { dataUtils } from "~/utils/utils-data";

type Choice = {
  id: string;
  label: string;
};

// Single quiz object.
export default class QuizMultipleChoicesModel extends QuizModel {
  audioLink?: string;
  imageVideoLink?: string;
  correctIndexes: number[];
  choices: Choice[];

  constructor() {
    super();
    this.type = QuizType.SINGLE_CHOICE;
    this.correctIndexes = [0];
    this.choices = [
      { id: dataUtils.generateUid(), label: "Lựa chọn 1" },
      { id: dataUtils.generateUid(), label: "Lựa chọn 2" },
    ];
  }
}
