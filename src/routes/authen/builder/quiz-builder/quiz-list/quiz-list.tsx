import React from "react";
import "~/routes/authen/builder/quiz-builder/quiz-list/quiz-list.scss";

export const QuizList: React.FC = () => {
  return (
    <div className="quiz-list" tabIndex={2}>
      <div className="quiz-cell meta-cell" />
      <div className="quiz-cell">Quiz</div>
    </div>
  );
};
