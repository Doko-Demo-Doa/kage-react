import React from "react";
import clsx from "clsx";

import "~/_player/main-layout/quiz-list-item/quiz-list-item.scss";

interface Props {
  isHead?: boolean;
}

export const QuizListItem: React.FC<Props> = ({ isHead }) => {
  return (
    <div className={clsx("quiz-list-item", isHead ? "quiz-list-lead" : "")}>
      <div className="question">Câu hỏi</div>
      <div className="score">Điểm</div>
      <div className="result">Kết quả</div>
    </div>
  );
};
