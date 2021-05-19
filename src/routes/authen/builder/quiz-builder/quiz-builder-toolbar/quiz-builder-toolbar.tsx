import React, { useContext } from "react";
import { Space, Button } from "antd";
import { observer } from "mobx-react";
import { PlusOutlined } from "@ant-design/icons";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar.scss";

export const QuizBuilderToolbar: React.FC = observer(() => {
  const store = useContext(StoreContext);

  return (
    <div className="quiz-builder-toolbar">
      <Space>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={() => store.quizListStore.newQuiz()}
        >
          New Quiz
        </Button>

        <hr />
        <div>Bạn đang edit bộ quiz nằm ở trang 12</div>
      </Space>
    </div>
  );
});
