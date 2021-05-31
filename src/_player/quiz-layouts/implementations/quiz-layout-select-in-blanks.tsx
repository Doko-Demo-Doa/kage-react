import React from "react";
import { Space, Checkbox } from "antd";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";

interface Props {
  // TODO: Remove "any"
  data: any;
}

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSelectInBlanks: React.FC<Props> = ({ data }) => {
  return (
    <QuizLayout
      content={
        <div className="quiz-layout-select-in-blanks">
          {data.audioLink && (
            <CustomAudioPlayer
              autoPlay={false}
              src={data.audioLink}
              header="Audio bunpou mondai 2"
              style={{ width: "60%", userSelect: "none" }}
            />
          )}

          <img className="irasutoya" src={data.imageLink} />

          <div className="naiyou">
            <h2 className="title">{formattingUtils.furiganaToJSX(data.content)}</h2>
            <Checkbox.Group className="selections">
              <Space direction="vertical">
                <Checkbox value={1}>{formattingUtils.furiganaToJSX("{食(た)}べると")}</Checkbox>
                <Checkbox value={2}>{"{食(た)}べ始める"}</Checkbox>
                <Checkbox value={3}>{"{食(た)}べるほど"}</Checkbox>
                <Checkbox value={4}>{"{食(た)}べるなら"}</Checkbox>
              </Space>
            </Checkbox.Group>
          </div>
        </div>
      }
    />
  );
};
