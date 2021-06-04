import React from "react";
import { makeAutoObservable, computed } from "mobx";
import { QuizResultType } from "~/typings/types";

/**
 * Chứa cả store cho quiz player lẫn context của nó.
 */
export class QuizPlayerStore {
  accumulatedPoints = 0;

  results: QuizResultType[] = [];

  constructor(numberOfQuizzes: number) {
    this.results = Array.from(Array(numberOfQuizzes).keys()).map(() => {
      return {
        acquired: 0,
        incorrectIds: [],
        result: "undetermined",
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
    return this.results.every((n) => n.result !== "undetermined");
  }
}

// Default Store instance exporting
export const qpStore = new QuizPlayerStore(0);

// MobX store.
export const QuizPlayerContext = React.createContext<QuizPlayerStore>(qpStore);
