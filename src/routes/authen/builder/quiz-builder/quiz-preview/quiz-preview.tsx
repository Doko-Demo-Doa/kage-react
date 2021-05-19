import React, { useContext, useMemo } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview.scss";

export const QuizPreview: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { name, instruction, selectedIndex } = store.quizDeckStore;

  const showIntro = useMemo(() => selectedIndex === -1, [selectedIndex]);

  return (
    <div className="quiz-preview">
      {showIntro ? (
        <div className="quiz-intro">
          <h1>{name || " "}</h1>
          <div className="instruction">{instruction}</div>
        </div>
      ) : (
        <div className="quiz-main">
          <h2 className="quiz-content">彼女は、毎日_____アイスクリームがすきです。</h2>
        </div>
      )}
    </div>
  );
});
