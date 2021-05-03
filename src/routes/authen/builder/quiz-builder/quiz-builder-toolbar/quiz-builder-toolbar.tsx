import React from "react";
import { Space, Button } from "antd";
import { FontSizeOutlined, PlusOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";

import "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar.scss";

export const QuizBuilderToolbar: React.FC = () => {
  return (
    <div className="quiz-builder-toolbar">
      <Space>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={async () => {
            const rr = await html2canvas(document.body);
            document.body.removeChild(rr);
            console.log(rr);
          }}
        >
          New Quiz
        </Button>
        <Button type="link" icon={<FontSizeOutlined />} size="middle" onClick={() => null} />

        <Button icon={<PlusOutlined />} type="primary" ghost>
          New Quiz
        </Button>
      </Space>
    </div>
  );
};
