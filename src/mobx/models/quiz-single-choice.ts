import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";
import { Choice } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";

// Single quiz object.
export default class QuizSingleChoiceModel extends QuizModel {
  correctId: string;
  choices: Choice[];

  constructor() {
    super();
    this.type = QuizType.SINGLE_CHOICE;
    this.correctId = "";
    this.choices = [
      { id: dataUtils.generateUid(), label: "Lựa chọn 1" },
      { id: dataUtils.generateUid(), label: "Lựa chọn 2" },
    ];
  }
}
