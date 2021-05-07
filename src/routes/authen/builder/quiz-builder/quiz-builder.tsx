import React, { useContext } from "react";
import { observer } from "mobx-react";
import { QuizBuilderToolbar } from "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar";

import "~/routes/authen/builder/quiz-builder/quiz-builder.scss";
import { StoreContext } from "~/mobx/store-context";

export const QuizBuilder: React.FC = observer(() => {
  const store = useContext(StoreContext);

  return (
    <div className="quiz-builder">
      <QuizBuilderToolbar />
      <div className="builder main-slide-builder">{store.quizDeckStore.list.length}</div>
    </div>
  );
});
