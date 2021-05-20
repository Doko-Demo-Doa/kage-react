import React, { useContext } from "react";
import { observer } from "mobx-react";
import clsx from "clsx";
import { StoreContext } from "~/mobx/store-context";
import { formattingUtils } from "~/utils/utils-formatting";

import "~/routes/authen/builder/quiz-builder/quiz-list/quiz-list.scss";

export const QuizList: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { list } = store.quizListStore;
  const { name, instruction, selectedIndex, setIndex } = store.quizDeckStore;

  return (
    <div className="quiz-list" tabIndex={2}>
      <div
        className={clsx("quiz-cell", "meta-cell", selectedIndex === -1 ? "selected-cell" : "")}
        onClick={() => setIndex(-1)}
      >
        <strong>{formattingUtils.furiganaToJSX(name)}</strong>
        <div>{formattingUtils.furiganaToJSX(formattingUtils.trimTextTo(instruction, 20))}</div>
      </div>
      {list.map((n, idx) => (
        <div
          key={n.id}
          className={clsx("quiz-cell", selectedIndex !== -1 ? "selected-cell" : "")}
          onClick={() => setIndex(idx)}
        >
          Quiz
        </div>
      ))}
    </div>
  );
});
