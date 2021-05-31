import React, { useState } from "react";
import { Space, Radio } from "antd";
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
            <h2 className="title">{formattingUtils.furiganaToJSX(data.content)}</h2>
            <Radio.Group
              className="selections"
              onChange={(e) => setSelected(e.target.value)}
              value={selected}
            >
              <Space direction="vertical">
                <Radio value={1}>{formattingUtils.furiganaToJSX("{食(た)}べると")}</Radio>
                <Radio value={2}>{"{食(た)}べ始める"}</Radio>
                <Radio value={3}>{"{食(た)}べるほど"}</Radio>
                <Radio value={4}>{"{食(た)}べるなら"}</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
      }
    />
  );
};
