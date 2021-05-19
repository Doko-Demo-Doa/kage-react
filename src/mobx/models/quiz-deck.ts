import { dataUtils } from "~/utils/utils-data";

// Quiz metadata
export default class QuizDeckModel {
  id: string;
  name: string;
  level: string;
  syllabus: string;
  instruction: string;
  selectedIndex: number;
  passingScore: number;

  constructor() {
    this.id = dataUtils.generateUid();
    this.name = "";
    this.level = "";
    this.syllabus = "";
    this.instruction = "";
    this.selectedIndex = -1;
    this.passingScore = 100;
  }
}
