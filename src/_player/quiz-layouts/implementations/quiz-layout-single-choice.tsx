import React from "react";
import AudioPlayer from "react-h5-audio-player";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";

import sample from "~/_player/assets/quiz-sample.json";

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSingleChoice: React.FC = () => {
  return (
    <QuizLayout
      content={
        <div className="quiz-layout-single-choice">
          <AudioPlayer
            autoPlay={false}
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            header="Audio bunpou mondai 2"
            showJumpControls={false}
            customVolumeControls={[]}
            customAdditionalControls={[]}
            style={{ width: "60%" }}
            onPlay={() => console.log("onPlay")}
          />

          <div className="naiyou">{sample.syllabus}</div>
        </div>
      }
    />
  );
};
