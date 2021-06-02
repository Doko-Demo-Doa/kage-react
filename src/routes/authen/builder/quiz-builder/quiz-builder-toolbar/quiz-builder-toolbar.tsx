import React, { useContext } from "react";
import { Space, Button, Tooltip } from "antd";
import { observer } from "mobx-react";
import { PlusOutlined, BackwardFilled, GiftOutlined } from "@ant-design/icons";
import { StoreContext } from "~/mobx/store-context";
import { EventBus } from "~/services/events-helper";

import "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar.scss";
import { fileUtils } from "~/utils/utils-files";

export const QuizBuilderToolbar: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { list, newQuiz } = store.quizListStore;
  const deck = store.quizDeckStore;

  function insertMediaFile() {
    // Code
  }

  return (
    <div className="quiz-builder-toolbar">
      <Space>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={() => {
            newQuiz();
            deck.setIndex(deck.selectedIndex + 1);
          }}
        >
          Tạo quiz mới
        </Button>

        <Tooltip placement="bottom" title="Chèn ảnh / video">
          <Button
            type="link"
            icon={<GiftOutlined />}
            size="middle"
            onClick={() => insertMediaFile()}
          />
        </Tooltip>

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
