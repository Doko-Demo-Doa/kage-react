import React from "react";
import { makeAutoObservable, computed, autorun, configure } from "mobx";
import { QuizResultType, QResult } from "~/typings/types";

const sample = require("~/_player/assets/quiz-sample.json");

let interv: ReturnType<typeof setInterval>;

configure({
  enforceActions: "never",
});

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

  // Index của quiz. Bắt đầu từ 0. -1 là hướng dẫn làm bài, -2 là trang tiêu đề.
  activeIndex = -2;
  clock = 0;
  clockRunning = false;

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

  startClock(initCeil: number) {
    this.clock = initCeil;

    this.clockRunning = true;
    interv = setInterval(() => {
      this.clock -= 1;
    }, 1000);
  }

  stopClock() {
    interv && clearInterval(interv);
    this.clockRunning = false;
  }

  nextPage() {
    this.activeIndex = this.activeIndex + 1;
  }

  prevPage() {
    this.activeIndex -= 1;
  }

  toPage(page: number) {
    if (page < -2) return -2;
    this.activeIndex = page;
  }

  get isInQuiz() {
    return this.activeIndex >= 0;
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
export const qpStore = new QuizPlayerStore(sample.quizzes.length);

// MobX store.
export const QuizPlayerContext = React.createContext<QuizPlayerStore>(qpStore);

// Side effects
autorun(() => {
  if (qpStore.activeIndex >= 0 && !qpStore.isFinished) {
    const countdown = sample.quizzes[qpStore.activeIndex].countdown;
    qpStore.startClock(countdown);
  }
});
