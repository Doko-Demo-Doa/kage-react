import React from "react";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import { CustomDropdown } from "~/_player/custom-dropdown/custom-dropdown";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";

interface Props {
  // TODO: Remove "any"
  data: QuizSelectInBlanksModel;
}

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSelectInBlanks: React.FC<Props> = ({ data }) => {
  return (
    <QuizLayout
      content={
        <div className="quiz-layout-inner quiz-layout-select-in-blanks">
          {data.audioLink && (
            <CustomAudioPlayer
              autoPlay={false}
              src={data.audioLink}
              style={{ width: "60%", userSelect: "none" }}
            />
          )}

          <img className="irasutoya" src={data.imageLink} />

          <div className="naiyou">
            <div className="sentence">
              {formattingUtils
                .replaceData(data.content ?? "")
                .with((key) => {
                  return <CustomDropdown key={key} id={key} matchers={data.matchers} />;
                })
                .map((elem: string | React.ReactNode) => {
                  if (React.isValidElement(elem)) {
                    return React.cloneElement(elem);
                  }
                  if (typeof elem === "string") {
                    return formattingUtils.htmlToJSX(elem);
                  }
                })}
            </div>
          </div>
        </div>
      }
    />
  );
};
