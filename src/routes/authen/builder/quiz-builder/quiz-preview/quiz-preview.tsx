import React, { useContext } from "react";
import { observer } from "mobx-react";
import { Radio, Space, Checkbox } from "antd";
import { StoreContext } from "~/mobx/store-context";
import { formattingUtils } from "~/utils/utils-formatting";
import { QuizType } from "~/common/static-data";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import QuizMultipleChoicesModel from "~/mobx/models/quiz-multiple-choices";

import "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview.scss";

export const QuizPreview: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { name, instruction, selectedIndex } = store.quizDeckStore;
  const { list } = store.quizListStore;

  const thisQuiz = list[selectedIndex];

  function getQuizContentLayout() {
    if (thisQuiz.type === QuizType.SINGLE_CHOICE) {
      const q = thisQuiz as QuizSingleChoiceModel;
      return (
        <Radio.Group value={q.correctIndex}>
          <Space direction="vertical">
            {q.choices.map((n, idx) => (
              <Radio key={idx} value={idx}>
                {n.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      );
    }
    if (thisQuiz.type === QuizType.MULTIPLE_CHOICES) {
      const q = thisQuiz as QuizMultipleChoicesModel;
      return (
        <Space direction="vertical">
          {q.choices.map((n) => (
            <Checkbox key={n.id} checked={q.correctIds.includes(n.id)}>
              {n.label}
            </Checkbox>
          ))}
        </Space>
      );
    }
    return null;
  }

  return (
    <div className="quiz-preview" role="quiz-preview">
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

          {getQuizContentLayout()}
        </div>
      )}
    </div>
  );
});
