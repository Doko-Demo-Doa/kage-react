import React, { useContext } from "react";
import { Space, Button } from "antd";
import { observer } from "mobx-react";
import { PlusOutlined, SoundOutlined, PictureFilled, BackwardFilled } from "@ant-design/icons";
import { StoreContext } from "~/mobx/store-context";
import { EventBus } from "~/services/events-helper";

import "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar.scss";
import { fileUtils } from "~/utils/utils-files";

export const QuizBuilderToolbar: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { list } = store.quizListStore;
  const deck = store.quizDeckStore;

  return (
    <div className="quiz-builder-toolbar">
      <Space>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={() => store.quizListStore.newQuiz()}
        >
          Tạo quiz mới
        </Button>

        <Button type="link" icon={<PictureFilled />} size="middle" />

        <Button type="link" icon={<SoundOutlined />} size="middle" />

        <hr />
        <div>Bạn đang edit bộ quiz nằm ở slide số 12</div>

        <Button
          onClick={() => EventBus.emit("SWITCH_TAB", "0")}
          icon={<BackwardFilled />}
          type="primary"
          danger
        >
          Quay lại
        </Button>

        <Button onClick={() => console.log(list.slice())} type="primary">
          Log
        </Button>

        <Button
          onClick={() => {
            fileUtils.exportQuizToFile(deck, list.slice());
          }}
          type="dashed"
        >
          Xuất ra file quiz
        </Button>
      </Space>
    </div>
  );
});
