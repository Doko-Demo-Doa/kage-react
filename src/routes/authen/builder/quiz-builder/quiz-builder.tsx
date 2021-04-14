import React from "react";

import { QuizBuilderToolbar } from "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar";

import "~/routes/authen/builder/quiz-builder/quiz-builder.scss";

export const QuizBuilder: React.FC = () => {
  return (
    <div className="quiz-builder">
      <QuizBuilderToolbar />
      <div className="main-slide-builder"></div>
    </div>
  );
};
