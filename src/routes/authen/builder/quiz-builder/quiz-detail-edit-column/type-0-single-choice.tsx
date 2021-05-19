import React, { useContext } from "react";
import { Form, Input } from "antd";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";

export const SingleChoiceForm: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const { list, setQuizTitle } = store.quizListStore;
  const thisQuiz = list[selectedIndex];

  return (
    <>
      <Form layout="vertical">
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

        <Form.Item label="Lựa chọn">
          <Input />
        </Form.Item>

        <Form.Item label="Lựa chọn">
          <Input />
        </Form.Item>

        <Form.Item label="Lựa chọn">
          <Input />
        </Form.Item>

        <Form.Item label="Lựa chọn">
          <Input />
        </Form.Item>
      </Form>
    </>
  );
});
