import React, { useEffect } from "react";
import { Space, Radio } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { EventBus } from "~/services/events-helper";

import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";

interface Props {
  data: QuizSingleChoiceModel;
  showResult?: boolean;
  onSubmit?: (isOk: boolean) => void | undefined;
}

let selected = -1;

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSingleChoice: React.FC<Props> = observer(({ data, showResult }) => {
  useEffect(() => {
    EventBus.on("NEXT_CLICK", () => {
      if (selected === data.correctIndex) {
        alert("Correct");
      } else {
        alert("Incorrect");
      }
    });

    return () => EventBus.off("NEXT_CLICK", () => undefined);
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
              onChange={(e) => {
                selected = e.target.value;
              }}
            >
              <Space direction="vertical">
                {data.choices.map((n, idx) => (
                  <div key={n.id} className="inner">
                    <CheckCircleFilled
                      className="ticker"
                      style={{ fontSize: "1rem", visibility: showResult ? "visible" : "hidden" }}
                    />

                    <Radio key={n.id} value={idx}>
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
