import React, { useContext } from "react";
import { Button, Form, Input } from "antd";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";

export const SelectInBlanksForm: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const { list, setQuizContent, addNewSelectInBlankDropdown } = store.quizListStore;
  const thisQuiz = list[selectedIndex] as QuizSelectInBlanksModel;

  return (
    <>
      <Form className="quiz-edit-form" layout="vertical">
        <Form.Item label="Nội dung câu hỏi">
          <Input.TextArea
            maxLength={1000}
            defaultValue={thisQuiz.content}
            value={thisQuiz.content}
            onChange={(e) => setQuizContent(thisQuiz.id, e.target.value)}
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
          />
        </Form.Item>

        <div className="note-select-in-blanks">
          Các câu hỏi được sắp xếp từ trái qua phải. Đặt vị trí các câu hỏi trong ngoặc vuông. Ví
          dụ: [q0] với q0 là mã hiệu câu hỏi. Trong cùng 1 câu quiz không được đặt 2 ngoặc vuông có
          mã hiệu giống nhau.
        </div>

        <Button onClick={() => addNewSelectInBlankDropdown(thisQuiz.id)}>Thêm nút lựa chọn</Button>

        <hr />
      </Form>
    </>
  );
});
