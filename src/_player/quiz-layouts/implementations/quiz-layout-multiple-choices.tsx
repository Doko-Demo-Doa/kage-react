import React from "react";
import { Space, Checkbox } from "antd";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import QuizMultipleChoicesModel from "~/mobx/models/quiz-multiple-choices";

interface Props {
  data: QuizMultipleChoicesModel;
}

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutMultipleChoices: React.FC<Props> = ({ data }) => {
  return (
    <QuizLayout
      content={
        <div className="quiz-layout-inner quiz-layout-choices quiz-layout-multiple-choices">
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
            <Checkbox.Group className="selections">
              <Space direction="vertical">
                {data.choices.map((n) => (
                  <Checkbox key={n.id}>{formattingUtils.furiganaToJSX(n.label)}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        </div>
      }
    />
  );
};
