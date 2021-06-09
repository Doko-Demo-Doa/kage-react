import React, { useContext } from "react";
import { Form, Input, Radio, Button } from "antd";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import { Colors } from "~/common/colors";

export const SingleChoiceForm: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const {
    list,
    setQuizTitle,
    setSingleCorrectChoice,
    addNewChoice,
    removeChoice,
    editChoiceLabel,
  } = store.quizListStore;
  const thisQuiz = list[selectedIndex] as QuizSingleChoiceModel;

  const disableRemoval = thisQuiz.choices.length <= 2;

  return (
    <>
      <Form className="quiz-edit-form" layout="vertical">
        <Form.Item label="Nội dung câu hỏi">
          <Input.TextArea
            maxLength={60}
            defaultValue={thisQuiz?.title}
            onChange={(e) => setQuizTitle(thisQuiz.id, e.target.value)}
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
          />
        </Form.Item>

        {thisQuiz.choices.map((n, idx) => (
          <Form.Item key={n.id}>
            <div className="single-choice">
              <Radio
                checked={thisQuiz.correctId === n.id}
                onChange={() => setSingleCorrectChoice(thisQuiz.id, n.id)}
              />
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
                disabled={disableRemoval}
                onClick={() => removeChoice(thisQuiz.id, idx)}
                icon={
                  <CloseCircleFilled
                    style={{
                      color: Colors.PALE_RED,
                      visibility: disableRemoval ? "hidden" : "visible",
                    }}
                  />
                }
              />
            </div>
          </Form.Item>
        ))}

        {thisQuiz.choices.length < 4 && (
          <Button
            style={{ marginBottom: 24 }}
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => addNewChoice(thisQuiz.id)}
          >
            Thêm lựa chọn
          </Button>
        )}
      </Form>
    </>
  );
});
