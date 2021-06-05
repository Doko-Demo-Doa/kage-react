import React from "react";
import { makeAutoObservable, computed } from "mobx";
import { QuizResultType, QResult } from "~/typings/types";

/**
 * Chứa cả store cho quiz player lẫn context của nó.
 */
export class QuizPlayerStore {
  id = "";
  level = "";
  syllabus = "";
  instruction = "";
  studentId = "";
  passingScore = 0;
  autoAudit = false;

  accumulatedPoints = 0;
  results: QuizResultType[] = [];

  constructor(numberOfQuizzes: number) {
    this.results = Array.from(Array(numberOfQuizzes).keys()).map(() => {
      return {
        acquired: 0,
        incorrectIds: [],
        judge: "undetermined",
      };
    });
    makeAutoObservable(
      this,
      {
        isFinished: computed,
      },
      { autoBind: true }
    );
  }

  get isFinished() {
    return this.results.every((n) => n.judge !== "undetermined");
  }

  setQuizResultFor(idx: number, points: number, incorrects: string[], finalJudge: QResult) {
    const newR = this.results.slice();
    newR[idx].acquired = points;
    newR[idx].incorrectIds = incorrects;
    newR[idx].judge = finalJudge;

    this.results = newR;
  }
}

// Default Store instance exporting
export const qpStore = new QuizPlayerStore(0);

// MobX store.
export const QuizPlayerContext = React.createContext<QuizPlayerStore>(qpStore);
