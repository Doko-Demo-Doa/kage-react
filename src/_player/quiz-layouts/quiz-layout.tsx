import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import ScrollBar from "react-perfect-scrollbar";

import { dataUtils } from "~/utils/utils-data";
import { QuizPlayerContext } from "~/mobx/quiz-player";
import { Colors } from "~/common/colors";

import "~/_player/quiz-layouts/quiz-layout.scss";

interface Props {
  content: React.ReactElement | JSX.Element;
}

export const QuizLayout: React.FC<Props> = observer(({ content }) => {
  const { results, activeIndex } = useContext(QuizPlayerContext);

  const thisR = results[activeIndex];

  function getRibbonColorClass() {
    if (thisR.judge === "correct") return Colors.GREEN;
    if (thisR.judge === "incorrect") return Colors.PALE_RED;
    if (thisR.judge === "undetermined") return Colors.PALE_RED;
    return Colors.CYAN_HIGH;
  }

  return (
    <>
      <ScrollBar className="content">
        {thisR.judge !== "undetermined" && (
          <span id="fork-github-ribbon">
            <div className={clsx("inner")} style={{ backgroundColor: getRibbonColorClass() }}>
              {dataUtils.mapQuizResultLabel(thisR.judge)}
            </div>
          </span>
        )}
        <div className="quiz-layout">{content}</div>
      </ScrollBar>
    </>
  );
});
