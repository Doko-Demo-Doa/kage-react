import React from "react";
import { observer } from "mobx-react";
import ScrollBar from "react-perfect-scrollbar";
import { QuizBuilderToolbar } from "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar";
import { QuizPreview } from "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview";
import { QuizList } from "~/routes/authen/builder/quiz-builder/quiz-list/quiz-list";

import { QuizDetailEditColumn } from "~/routes/authen/builder/quiz-builder/quiz-detail-edit-column/quiz-detail-edit-column";
import { QuizMetaColumn } from "~/routes/authen/builder/quiz-builder/quiz-meta-column/quiz-meta-column";

import "~/routes/authen/builder/quiz-builder/quiz-builder.scss";

export const QuizBuilder: React.FC = observer(() => {
  return (
    <div className="quiz-builder">
      <QuizBuilderToolbar />
      <div className="builder main-quiz-builder">
        <QuizPreview />
        <ScrollBar className="quiz-edit-column quiz-detail-edit">
          <QuizDetailEditColumn />
        </ScrollBar>
        <div className="quiz-edit-column quiz-meta">
          <QuizMetaColumn />
        </div>
      </div>

      <QuizList />
    </div>
  );
});
