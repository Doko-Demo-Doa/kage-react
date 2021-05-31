import React from "react";
import { Space, Checkbox } from "antd";
import AudioPlayer from "react-h5-audio-player";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";

interface Props {
  // TODO: Remove "any"
  data: any;
}

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutMultipleChoices: React.FC<Props> = ({ data }) => {
  return (
    <QuizLayout
      content={
        <div className="quiz-layout-choices quiz-layout-multiple-choices">
          {data.audioLink && (
            <AudioPlayer
              autoPlay={false}
              autoPlayAfterSrcChange={false}
              src={data.audioLink}
              header="Audio bunpou mondai 2"
              showJumpControls={false}
              customVolumeControls={[]}
              customAdditionalControls={[]}
              style={{ width: "60%", userSelect: "none" }}
              onPlay={() => console.log("onPlay")}
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
