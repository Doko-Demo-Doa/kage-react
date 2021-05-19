import { makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";
import QuizDeckModel from "../models/quiz-deck";

export class QuizDeckStore {
  rootStore: RootStore;
  id: string;
  name: string;
  level: string;
  syllabus: string;
  instruction: string;
  selectedIndex: number;
  passingScore: number;

  constructor(rs: RootStore) {
    this.rootStore = rs;
    const scaffold = new QuizDeckModel();
    this.id = scaffold.id;
    this.name = scaffold.name;
    this.level = scaffold.level;
    this.syllabus = scaffold.syllabus;
    this.instruction = scaffold.instruction;
    this.selectedIndex = scaffold.selectedIndex;
    this.passingScore = scaffold.passingScore;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setDeckName(newTitle: string) {
    this.name = newTitle;
  }

  setDeckLevel(newLevel: string) {
    this.level = newLevel;
  }

  setInstruction(instruction: string) {
    this.instruction = instruction;
  }

  setPassingScore(score: number) {
    this.passingScore = score;
  }
}
