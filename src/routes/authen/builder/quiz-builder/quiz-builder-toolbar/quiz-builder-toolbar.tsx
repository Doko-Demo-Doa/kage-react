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
  const { list, newQuiz, setQuizAudio } = store.quizListStore;
  const deck = store.quizDeckStore;

  /**
   * Chèn media vào quiz.
   * @param currentQuizIndex Cần biến này là vì trong quá trình convert, user có thể navigate linh tinh sang các tab khác.
   * Cần phải đặt vững số index để tránh bị insert nhầm.
   * @returns
   */
  async function insertMediaFile(currentQuizIndex: number) {
    const path = await fileUtils.selectSingleFile();
    if (!path) return;
    const mType = fileUtils.detectMediaType(path);
    if (mType === MediaType.AUDIO) {
      const quizCacheAssetDir = fileUtils.getQuizCacheDirectory("assets");
      audioUtils.optimizeAudio(
        path,
        quizCacheAssetDir,
        (progress, filePath, fileName, extension) => {
          const thisQuiz = list[currentQuizIndex];
          if (progress === "end") {
            // Hiển thị message báo convert
            setQuizAudio(thisQuiz.id, `${fileName}.${extension}`);
            console.log(filePath, fileName, extension);
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
            disabled={deck.selectedIndex < 0}
            onClick={() => insertMediaFile(deck.selectedIndex)}
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
