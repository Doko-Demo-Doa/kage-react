import React, { useContext } from "react";
import { Form, Input, Radio, Button } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";
import { Colors } from "~/common/colors";

export const SelectInBlanksForm: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const { list, editChoiceLabel, setSingleCorrectChoice, setQuizNote } = store.quizListStore;
  const thisQuiz = list[selectedIndex] as QuizSelectInBlanksModel;

  return (
    <>
      <Form className="quiz-edit-form" layout="vertical">
        <Form.Item label="Nội dung câu hỏi">
          <Input.TextArea
            maxLength={1000}
            defaultValue={thisQuiz?.note}
            onChange={(e) => setQuizNote(thisQuiz.id, e.target.value)}
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
          />
        </Form.Item>

        {thisQuiz.matchers.map((n, idx) => (
          <Form.Item key={n.id}>
            <div className="single-choice">
              <Radio onChange={() => setSingleCorrectChoice(thisQuiz.id, idx)} />
              <div className="separator" />
              <Input
                placeholder={`Lựa chọn ${idx + 1}`}
                defaultValue={n.label}
                onChange={(e) => editChoiceLabel(thisQuiz.id, idx, e.target.value)}
              />
              <div className="separator" />
              <Button
                type="text"
                size="small"
                icon={
                  <CloseCircleFilled
                    style={{
                      color: Colors.PALE_RED,
                    }}
                  />
                }
              />
            </div>
          </Form.Item>
        ))}
      </Form>
    </>
  );
});
