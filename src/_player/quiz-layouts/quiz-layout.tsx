import React from "react";
import "react-h5-audio-player/lib/styles.css";

import "~/_player/quiz-layouts/quiz-layout.scss";

interface Props {
  content: React.ReactElement | JSX.Element;
}

export const QuizLayout: React.FC<Props> = ({ content }) => {
  return <div className="quiz-layout">{content}</div>;
};
