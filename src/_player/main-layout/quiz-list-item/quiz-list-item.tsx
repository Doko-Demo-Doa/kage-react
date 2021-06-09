import React from "react";
import clsx from "clsx";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { QuizType } from "~/common/static-data";
import { Colors } from "~/common/colors";

import "~/_player/main-layout/quiz-list-item/quiz-list-item.scss";

interface Props {
  isHead?: boolean;
  type?: QuizType;
  score?: number;
  tagline?: string;
  result?: boolean;
}

export const QuizListItem: React.FC<Props> = ({ isHead, tagline, score, result }) => {
  return (
    <div className={clsx("quiz-list-item", isHead ? "quiz-list-lead" : "")}>
      <div className="question">{isHead ? "Câu hỏi" : tagline}</div>
      <div className="score">{isHead ? "Điểm" : score || 0}</div>
      <div className="result">
        {isHead ? (
          ""
        ) : result ? (
          <CheckCircleFilled style={{ color: Colors.GREEN }} />
        ) : (
          <CloseCircleFilled style={{ color: Colors.PALE_RED }} />
        )}
      </div>
    </div>
  );
};
