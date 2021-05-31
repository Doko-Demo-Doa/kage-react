import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";
import { Choice } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";

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
    this.choices = [
      { id: dataUtils.generateUid(), label: "Lựa chọn 1" },
      { id: dataUtils.generateUid(), label: "Lựa chọn 2" },
    ];
  }
}
