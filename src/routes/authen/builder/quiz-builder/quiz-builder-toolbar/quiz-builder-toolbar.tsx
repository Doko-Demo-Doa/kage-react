import React, { useContext } from "react";
import { Space, Button } from "antd";
import { observer } from "mobx-react";
import { FontSizeOutlined, PlusOutlined } from "@ant-design/icons";

import "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar.scss";
import { StoreContext } from "~/mobx/store-context";

export const QuizBuilderToolbar: React.FC = observer(() => {
  const store = useContext(StoreContext);

  return (
    <div className="quiz-builder-toolbar">
      <Space>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={() => store.quizDeckStore.newQuiz()}
        >
          New Quiz
        </Button>
        <Button type="link" icon={<FontSizeOutlined />} size="middle" onClick={() => null} />
      </Space>
    </div>
  );
});
