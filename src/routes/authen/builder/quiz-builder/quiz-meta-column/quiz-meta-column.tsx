import React from "react";
import { Input, Form, InputNumber } from "antd";

import "~/routes/authen/builder/quiz-builder/quiz-meta-column/quiz-meta-column.scss";

export const QuizMetaColumn: React.FC = () => {
  const formLayout = { wrapperCol: { span: 14 } };

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Tên bộ quiz">
          <Input maxLength={64} />
        </Form.Item>

        <Form.Item label="Hướng dẫn">
          <Input.TextArea
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
            maxLength={120}
          />
        </Form.Item>

        <div className="max-score">
          <InputNumber
            id="maximum-score"
            placeholder="Điểm tối đa"
            className="max-score-input"
            min={1}
            max={100}
          />
          <div className="lbl">Tối đa: 100</div>
        </div>
      </Form>
    </>
  );
};
