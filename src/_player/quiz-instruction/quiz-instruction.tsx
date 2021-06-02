import React from "react";
import { formattingUtils } from "~/utils/utils-formatting";

import "~/_player/quiz-instruction/quiz-instruction.scss";

export const QuizInstruction: React.FC = () => {
  return (
    <div className="quiz-instruction">
      <h1>Hướng dẫn làm bài</h1>
      <h2>練習指導</h2>

      <div className="ins">Nhìn tranh và viết câu hoàn chỉnh.</div>
      <div className="ins">
        {formattingUtils.furiganaToJSX(
          "例：→ キング{牧師(ぼくし)}は {夢(ゆめ)}が あると {言(い)}いました。"
        )}
      </div>

      <br />

      <img alt="2" src="https://i.ibb.co/613xksG/img.jpg" />
    </div>
  );
};
