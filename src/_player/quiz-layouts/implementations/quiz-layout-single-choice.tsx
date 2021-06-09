import React, { useContext, useEffect } from "react";
import { Space, Radio } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { EventBus } from "~/services/events-helper";

import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import { QuizPlayerContext } from "~/mobx/quiz-player";

import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import { uiUtils } from "~/utils/utils-ui";

interface Props {
  data: QuizSingleChoiceModel;
}

let selected = "";

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSingleChoice: React.FC<Props> = observer(({ data }) => {
  const { onSubmit, isFinished, results, activeIndex } = useContext(QuizPlayerContext);

  const thisR = results[activeIndex];

  useEffect(() => {
    EventBus.on("NEXT_CLICK", () => {
      if (!selected) {
        return uiUtils.openNotification(
          "warn",
          "Khoan đã!",
          "Bạn phải hoàn thành câu hỏi này trước."
        );
      }
      if (selected === data.correctId) {
        onSubmit?.("correct", [selected]);
      } else {
        onSubmit?.("incorrect", [selected]);
      }
    });

    return () => {
      EventBus.clear();
    };
  }, []);

  return (
    <QuizLayout
      content={
        <div className="quiz-layout-inner quiz-layout-choices quiz-layout-single-choice">
          {data.audioLink && (
            <CustomAudioPlayer
              autoPlay={false}
              src={data.audioLink}
              style={{ width: "60%", userSelect: "none" }}
            />
          )}

          <img className="irasutoya" src={data.imageLink} />

          <div className="naiyou">
            <h2 className="title">{formattingUtils.furiganaToJSX(data.title)}</h2>
            <Radio.Group
              className="selections"
              disabled={isFinished}
              defaultValue={thisR.selectedIds[0]}
              onChange={(e) => {
                selected = e.target.value;
              }}
            >
              <Space direction="vertical">
                {data.choices.map((n) => (
                  <div key={n.id} className="inner">
                    <CheckCircleFilled
                      className="ticker"
                      style={{
                        fontSize: "1rem",
                        visibility: thisR.judge === "correct" ? "visible" : "hidden",
                      }}
                    />

                    <Radio key={n.id} value={n.id}>
                      {formattingUtils.furiganaToJSX(n.label)}
                    </Radio>
                  </div>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>
      }
    />
  );
});
