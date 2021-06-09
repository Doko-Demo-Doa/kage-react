import React from "react";
import { Modal } from "antd";
import { makeAutoObservable, autorun, configure } from "mobx";
import { QuizResultType, QResult, AnswerResultType, SelectedQuizId } from "~/typings/types";
import QuizModel from "~/mobx/models/quiz";
import { ResultNotification } from "~/_player/result-notification/result-notification";
import { uiUtils } from "~/utils/utils-ui";

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

  // Index của quiz. Bắt đầu từ 0. -1 là hướng dẫn làm bài, -2 là trang tiêu đề.
  activeIndex = -2;
  clock = 0;
  clockRunning = false;

  quizzes: QuizModel[] = [];
  results: QuizResultType[] = [];

  constructor(numberOfQuizzes: number) {
    this.quizzes = sample.quizzes;
    this.results = Array.from(Array(numberOfQuizzes).keys()).map(() => {
      return {
        acquired: 0,
        selectedIds: [],
        judge: "undetermined",
      };
    });
    makeAutoObservable(this, {}, { autoBind: true });
  }

  startClock(initCeil: number) {
    this.clock = initCeil;

    this.clockRunning = true;
    interv = setInterval(() => {
      if (this.clock <= 0) {
        this.stopClock(false);
        if (this.results[this.activeIndex].judge === "undetermined") {
          this.showModal("timeout");
        }
        return;
      }
      this.clock -= 1;
    }, 1000);
  }

  stopClock(dismissClock?: boolean) {
    interv && clearInterval(interv);
    if (dismissClock) {
      this.clockRunning = false;
    }
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

  showModal(type: AnswerResultType, onOk?: () => void | undefined) {
    Modal.confirm({
      title: "",
      icon: <div />,
      content: <ResultNotification type={type} />,
      onOk() {
        onOk?.();
      },
      onCancel: undefined,
      cancelButtonProps: { style: { display: "none" } },
    });
  }

  onSubmit(result: QResult, selectedIds?: SelectedQuizId[]) {
    const thisQ = this.quizzes[this.activeIndex];

    // Check: Nếu kết quả ok thì gán vào mảng kết quả.
    if (result && result !== "undetermined") {
      const newR = this.results.slice();
      const r = newR[this.activeIndex];

      // Gán kết quả
      r.acquired = thisQ.score;
      r.selectedIds = selectedIds || [];
      r.judge = result;

      this.results = newR;
    }

    // Hiển thị thông báo tương ứng.
    if (result === "correct") {
      uiUtils.showMessage("Chính xác", "success");
    } else if (result === "incorrect") {
      uiUtils.showMessage("Sai rồi", "error");
    } else if (result === "mixed") {
      uiUtils.showMessage("Chưa đúng hoàn toàn", "warn");
    }

    // Nếu đã submit đáp án đủ thì cho next.
    if (result !== "undetermined" && this.activeIndex < this.quizzes.length) {
      return this.nextPage();
    }

    // Dừng đồng hồ đếm ngược
    this.stopClock();
  }

  get isInQuiz() {
    return this.activeIndex >= 0;
  }

  get isFinished() {
    return this.results.every((n) => n.judge !== "undetermined");
  }

  get accumulatedPoints() {
    return this.results.map((n) => n.acquired).reduce((a, b) => a + b);
  }

  setQuizResultFor(idx: number, points: number, selectedIds: string[], finalJudge: QResult) {
    const newR = this.results.slice();
    newR[idx].acquired = points;
    newR[idx].selectedIds = selectedIds;
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
  const currentQuiz: QuizModel = sample.quizzes[qpStore.activeIndex];
  if (qpStore.activeIndex >= 0 && !qpStore.isFinished && (currentQuiz.countdown || 0) > 0) {
    const countdown = sample.quizzes[qpStore.activeIndex].countdown;
    qpStore.startClock(countdown);
  }
});
