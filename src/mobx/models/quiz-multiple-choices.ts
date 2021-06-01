import { QuizType } from "~/common/static-data";
import QuizModel from "~/mobx/models/quiz";
import { Choice } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";

// Single quiz object.
export default class QuizMultipleChoicesModel extends QuizModel {
  audioLink?: string;
  imageLink?: string;
  correctIds: string[];
  choices: Choice[];

  constructor() {
    super();
    this.type = QuizType.MULTIPLE_CHOICES;
    this.correctIds = [];
    this.choices = [
      { id: dataUtils.generateShortUid(), label: "Lựa chọn 1" },
      { id: dataUtils.generateShortUid(), label: "Lựa chọn 2" },
    ];
  }
}
