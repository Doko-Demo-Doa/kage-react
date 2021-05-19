import React from "react";
import { Form, Input } from "antd";

export const SingleChoiceForm: React.FC = () => {
  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Nội dung câu hỏi">
          <Input.TextArea
            maxLength={60}
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
};
