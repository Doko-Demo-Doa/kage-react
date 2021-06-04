import React from "react";
import { formattingUtils } from "~/utils/utils-formatting";

import "~/_player/quiz-instruction/quiz-instruction.scss";

interface Props {
  instruction?: string;
  example?: string;
}

export const QuizInstruction: React.FC<Props> = ({ instruction, example }) => {
  return (
    <div className="quiz-instruction">
      <h1>Hướng dẫn làm bài</h1>
      <h2>練習指導</h2>

      <div className="ins">{instruction}</div>
      <div className="ins">{formattingUtils.furiganaToJSX(example)}</div>

      <br />

      <img alt="2" src="https://i.ibb.co/613xksG/img.jpg" />
    </div>
  );
};
