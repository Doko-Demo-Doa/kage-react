import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Space, Checkbox } from "antd";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import QuizMultipleChoicesModel from "~/mobx/models/quiz-multiple-choices";
import { QuizPlayerContext } from "~/mobx/quiz-player";
import { EventBus } from "~/services/events-helper";
import { uiUtils } from "~/utils/utils-ui";

interface Props {
  data: QuizMultipleChoicesModel;
}

let selectedIds: string[] = [];

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutMultipleChoices: React.FC<Props> = observer(({ data }) => {
  const { onSubmit } = useContext(QuizPlayerContext);

  useEffect(() => {
    EventBus.on("NEXT_CLICK", () => {
      console.log("select", selectedIds);
      if (selectedIds.length <= 0) {
        return uiUtils.openNotification(
          "warn",
          "Khoan đã!",
          "Bạn phải hoàn thành câu hỏi này trước."
        );
      }
      if (selectedIds.every((n) => data.correctIds.includes(n))) {
        return onSubmit?.("correct");
      } else if (selectedIds.some((n) => data.correctIds.includes(n))) {
        return onSubmit?.("mixed");
      } else if (selectedIds.every((n) => !data.correctIds.includes(n))) {
        return onSubmit?.("incorrect");
      }
    });

    return () => EventBus.clear();
  }, []);

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
            <Checkbox.Group
              className="selections"
              onChange={(vals) => {
                selectedIds = vals.map((n) => String(n));
              }}
            >
              <Space direction="vertical">
                {data.choices.map((n) => (
                  <Checkbox value={n.id} key={n.id}>
                    {formattingUtils.furiganaToJSX(n.label)}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        </div>
      }
    />
  );
});
