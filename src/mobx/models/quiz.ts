import { QuizType } from "~/common/static-data";

// Single quiz object.
export default class QuizModel {
  id: string;
  type: QuizType;
  countdown?: number;
  title?: string;
  note?: string;
  score: number;

  constructor() {
    this.id = "0";
    this.type = QuizType.SINGLE_CHOICE;
    this.score = 0;
  }
}
