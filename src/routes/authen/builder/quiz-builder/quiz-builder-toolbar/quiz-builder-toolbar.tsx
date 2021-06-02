import React, { useContext } from "react";
import { Space, Button, Tooltip } from "antd";
import { observer } from "mobx-react";
import { PlusOutlined, BackwardFilled, GiftOutlined, LoadingOutlined } from "@ant-design/icons";
import { StoreContext } from "~/mobx/store-context";
import { EventBus } from "~/services/events-helper";
import { fileUtils } from "~/utils/utils-files";
import { audioUtils } from "~/utils/utils-conversions";
import { MediaType } from "~/common/static-data";

import "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar.scss";

export const QuizBuilderToolbar: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { list, newQuiz } = store.quizListStore;
  const deck = store.quizDeckStore;

  async function insertMediaFile() {
    const path = await fileUtils.selectSingleFile();
    if (!path) return;
    const mType = fileUtils.detectMediaType(path);
    if (mType === MediaType.AUDIO) {
      audioUtils.optimizeAudio(
        path,
        fileUtils.getQuizCacheDirectory("assets"),
        (progress, filePath, fileName, extension) => {
          if (progress === "end") {
            // Hiển thị message báo convert
            console.log(fileName, extension);
          }
        }
      );
    }
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

        <div className="holder" />

        <LoadingOutlined />
      </Space>
    </div>
  );
});
