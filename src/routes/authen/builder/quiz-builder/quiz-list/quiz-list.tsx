import React, { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/quiz-builder/quiz-list/quiz-list.scss";

export const QuizList: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { list } = store.quizListStore;

  return (
    <div className="quiz-list" tabIndex={2}>
      <div className="quiz-cell meta-cell" />
      {list.map((n) => (
        <div key={n.id} className="quiz-cell">
          Quiz
        </div>
      ))}
    </div>
  );
});
