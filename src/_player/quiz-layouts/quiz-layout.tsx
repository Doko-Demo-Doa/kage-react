import React from "react";
import { Button } from "antd";
import ScrollBar from "react-perfect-scrollbar";
import { RightCircleFilled } from "@ant-design/icons";
import { Colors } from "~/common/colors";

import "~/_player/quiz-layouts/quiz-layout.scss";

interface Props {
  content: React.ReactElement | JSX.Element;
  onNext?: () => void | undefined;
}

export const QuizLayout: React.FC<Props> = ({ content, onNext }) => {
  return (
    <>
      <ScrollBar className="content">
        <div className="quiz-layout">{content}</div>
      </ScrollBar>
      <div className="footer">
        <div className="left-side">
          Điểm hiện tại: <strong>233</strong>
        </div>
        <Button
          onClick={() => onNext?.()}
          icon={<RightCircleFilled style={{ color: Colors.CYAN_HIGH }} />}
        >
          {"Tiếp theo"}
        </Button>
      </div>
    </>
  );
};
