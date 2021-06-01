import React, { useState } from "react";
import { Space, Radio } from "antd";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";

interface Props {
  // TODO: Remove "any"
  data: QuizSingleChoiceModel;
}

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSingleChoice: React.FC<Props> = ({ data }) => {
  const [selected, setSelected] = useState(0);

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
              onChange={(e) => setSelected(e.target.value)}
              value={selected}
            >
              <Space direction="vertical">
                {data.choices.map((n) => (
                  <Radio key={n.id} value={n.id}>
                    {formattingUtils.furiganaToJSX(n.label)}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>
      }
    />
  );
};
