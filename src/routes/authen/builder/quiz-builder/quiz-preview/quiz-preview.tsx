import React, { useContext } from "react";
import { observer } from "mobx-react";
import { Radio, Space, Checkbox } from "antd";
import ScrollBar from "react-perfect-scrollbar";
import { StoreContext } from "~/mobx/store-context";
import { formattingUtils } from "~/utils/utils-formatting";
import { fileUtils } from "~/utils/utils-files";
import { QuizType } from "~/common/static-data";
import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import QuizMultipleChoicesModel from "~/mobx/models/quiz-multiple-choices";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";

import { EditableSelectableDropdown } from "~/components/editable-selectable-dropdown/editable-selectable-dropdown";

import "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview.scss";

export const QuizPreview: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { name, instruction, selectedIndex } = store.quizDeckStore;
  const { list } = store.quizListStore;

  const thisQuiz = list[selectedIndex];

  function getQuizContentLayout() {
    if (thisQuiz.type === QuizType.SINGLE_CHOICE) {
      const q = thisQuiz as QuizSingleChoiceModel;
      return (
        <Radio.Group value={q.correctIndex}>
          <Space direction="vertical">
            {q.choices.map((n, idx) => (
              <Radio key={idx} value={idx}>
                {n.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      );
    }
    if (thisQuiz.type === QuizType.MULTIPLE_CHOICES) {
      const q = thisQuiz as QuizMultipleChoicesModel;
      return (
        <Space direction="vertical">
          {q.choices.map((n) => (
            <Checkbox key={n.id} checked={q.correctIds.includes(n.id)}>
              {n.label}
            </Checkbox>
          ))}
        </Space>
      );
    }
    if (thisQuiz.type === QuizType.SELECT_IN_THE_BLANKS) {
      // const q = thisQuiz as QuizSelectInBlanksModel;

      return (
        <div className="quiz-select-in-blanks-preview">
          <div>
            {formattingUtils
              .replaceData(thisQuiz.note ?? "")
              .with((key) => {
                return <EditableSelectableDropdown key={key} id={key} />;
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
      );
    }
    return null;
  }

  return (
    <ScrollBar className="quiz-preview" role="quiz-preview">
      {!thisQuiz ? (
        <div className="quiz-intro">
          <h1>{formattingUtils.furiganaToJSX(name)}</h1>
          <div className="instruction">{formattingUtils.furiganaToJSX(instruction)}</div>
        </div>
      ) : (
        <div className="quiz-main">
          {thisQuiz.audioLink && (
            <CustomAudioPlayer
              src={fileUtils.getUsableQuizAssetUrl(thisQuiz.audioLink)}
              style={{ width: "100%" }}
            />
          )}

          {thisQuiz.imageLink && (
            <img
              alt="minh-hoa"
              className="quiz-image"
              src={fileUtils.getUsableQuizAssetUrl(thisQuiz.imageLink)}
            />
          )}

          <h2 className="quiz-content">
            {formattingUtils.furiganaToJSX(list[selectedIndex]?.title)}
          </h2>

          {getQuizContentLayout()}
        </div>
      )}
    </ScrollBar>
  );
});
