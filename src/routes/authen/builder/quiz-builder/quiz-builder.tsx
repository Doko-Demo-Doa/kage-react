import React, { useContext } from "react";
import { observer } from "mobx-react";
import { QuizBuilderToolbar } from "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/quiz-builder/quiz-builder.scss";

export const QuizBuilder: React.FC = observer(() => {
  const store = useContext(StoreContext);

  return (
    <div className="quiz-builder">
      <QuizBuilderToolbar />
      <div className="builder main-quiz-builder">
        <div>Quiz Preview</div>
        <div className="quiz-detail-edit">Quiz detail edit</div>
        <div className="quiz-meta">Quiz meta</div>
      </div>
    </div>
  );
});
