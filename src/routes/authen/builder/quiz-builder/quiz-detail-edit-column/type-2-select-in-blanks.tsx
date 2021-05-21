import React, { useContext } from "react";
import { Form, Input } from "antd";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";

export const SelectInBlanksForm: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const { list, setQuizTitle, setQuizNote } = store.quizListStore;
  const thisQuiz = list[selectedIndex] as QuizSelectInBlanksModel;

  return (
    <>
      <Form className="quiz-edit-form" layout="vertical">
        <Form.Item label="Nội dung câu hỏi">
          <Input.TextArea
            maxLength={60}
            defaultValue={thisQuiz?.note}
            onChange={(e) => setQuizNote(thisQuiz.id, e.target.value)}
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
});
