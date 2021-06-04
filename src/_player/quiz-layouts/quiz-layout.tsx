import React from "react";
import ScrollBar from "react-perfect-scrollbar";

import "~/_player/quiz-layouts/quiz-layout.scss";

interface Props {
  content: React.ReactElement | JSX.Element;
  onNext?: () => void | undefined;
}

export const QuizLayout: React.FC<Props> = ({ content }) => {
  return (
    <>
      <ScrollBar className="content">
        <div className="quiz-layout">{content}</div>
      </ScrollBar>
    </>
  );
};
