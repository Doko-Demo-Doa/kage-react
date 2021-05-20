import React, { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import { formattingUtils } from "~/utils/utils-formatting";

import "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview.scss";

export const QuizPreview: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { name, instruction, selectedIndex } = store.quizDeckStore;
  const { list } = store.quizListStore;

  const thisQuiz = list[selectedIndex];

  return (
    <div className="quiz-preview">
      {!thisQuiz ? (
        <div className="quiz-intro">
          <h1>{formattingUtils.furiganaToJSX(name)}</h1>
          <div className="instruction">{formattingUtils.furiganaToJSX(instruction)}</div>
        </div>
      ) : (
        <div className="quiz-main">
          <h2 className="quiz-content">
            {formattingUtils.furiganaToJSX(list[selectedIndex]?.title)}
          </h2>
        </div>
      )}
    </div>
  );
});
