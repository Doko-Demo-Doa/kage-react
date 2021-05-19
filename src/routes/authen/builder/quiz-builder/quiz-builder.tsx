import React, { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import { QuizBuilderToolbar } from "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar";
import { QuizPreview } from "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview";
import { QuizList } from "~/routes/authen/builder/quiz-builder/quiz-list/quiz-list";

import { QuizMetaColumn } from "~/routes/authen/builder/quiz-builder/quiz-meta-column/quiz-meta-column";

import "~/routes/authen/builder/quiz-builder/quiz-builder.scss";

export const QuizBuilder: React.FC = observer(() => {
  const store = useContext(StoreContext);

  return (
    <div className="quiz-builder">
      <QuizBuilderToolbar />
      <div className="builder main-quiz-builder">
        <QuizPreview />
        <div className="quiz-edit-column quiz-detail-edit">Quiz detail edit</div>
        <div className="quiz-edit-column quiz-meta">
          <QuizMetaColumn />
        </div>
      </div>

      <QuizList />
    </div>
  );
});
