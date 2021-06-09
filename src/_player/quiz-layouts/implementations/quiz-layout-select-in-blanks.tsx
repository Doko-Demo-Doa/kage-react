import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { uniqWith } from "rambdax";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";
import { CustomDropdown } from "~/_player/custom-dropdown/custom-dropdown";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";
import { QuizPlayerContext } from "~/mobx/quiz-player";
import { EventBus } from "~/services/events-helper";
import { uiUtils } from "~/utils/utils-ui";

interface Props {
  data: QuizSelectInBlanksModel;
}

type SelectedItemType = {
  matcherId: string;
  choiceId: string;
  isCorrect?: boolean;
};

let selectedIds: SelectedItemType[] = [];

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSelectInBlanks: React.FC<Props> = observer(({ data }) => {
  const { onSubmit } = useContext(QuizPlayerContext);

  useEffect(() => {
    EventBus.on("NEXT_CLICK", () => {
      if (selectedIds.length <= 0 || selectedIds.length < data.matchers.length) {
        return uiUtils.openNotification(
          "warn",
          "Khoan đã!",
          "Bạn phải hoàn thành câu hỏi này trước."
        );
      }
      if (selectedIds.every((n) => n.isCorrect)) {
        onSubmit?.("correct");
      } else if (selectedIds.every((n) => !n.isCorrect)) {
        onSubmit?.("incorrect");
      } else {
        onSubmit?.("mixed");
      }
    });

    return () => EventBus.clear();
  }, []);

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
                  const targetMatcher = data.matchers.find((n) => n.id === key)!;

                  return (
                    <CustomDropdown
                      key={key}
                      id={key}
                      matchers={data.matchers}
                      onSelect={(rKey) => {
                        const item: SelectedItemType = {
                          matcherId: key,
                          choiceId: rKey,
                          isCorrect: targetMatcher.correctChoice === rKey,
                        };
                        selectedIds = [
                          ...uniqWith((he, she) => he.matcherId === she.matcherId, [
                            item,
                            ...selectedIds,
                          ]),
                        ];
                        console.log(selectedIds);
                      }}
                    />
                  );
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
});
