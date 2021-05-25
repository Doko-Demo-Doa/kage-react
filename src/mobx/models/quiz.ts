import { QuizType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";

// Single quiz object.
export default class QuizModel {
  id: string;
  type: QuizType;
  countdown?: number;
  title?: string;
  note?: string;
  score: number;
  autoAudit?: boolean;

  constructor() {
    this.id = dataUtils.generateUid();
    this.type = QuizType.SINGLE_CHOICE;
    this.countdown = 0;
    this.title = "";
    this.note = "";
    this.score = 0;
    this.autoAudit = false;
  }
}
