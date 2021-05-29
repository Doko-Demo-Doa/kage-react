import React, { useContext } from "react";
import { Select, Form, Empty, Checkbox } from "antd";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import { QuizType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";
import { uiUtils } from "~/utils/utils-ui";

import { SingleChoiceForm } from "~/routes/authen/builder/quiz-builder/quiz-detail-edit-column/type-0-single-choice";
import { MultipleChoicesForm } from "~/routes/authen/builder/quiz-builder/quiz-detail-edit-column/type-1-multiple-choices";
import { SelectInBlanksForm } from "~/routes/authen/builder/quiz-builder/quiz-detail-edit-column/type-2-select-in-blanks";

import "~/routes/authen/builder/quiz-builder/quiz-detail-edit-column/quiz-edit-form.scss";

const { Option } = Select;

const options = [
  {
    value: QuizType.SINGLE_CHOICE,
    label: dataUtils.mapQuizLabel(QuizType.SINGLE_CHOICE),
  },
  {
    value: QuizType.MULTIPLE_CHOICES,
    label: dataUtils.mapQuizLabel(QuizType.MULTIPLE_CHOICES),
  },
  {
    value: QuizType.SELECT_IN_THE_BLANKS,
    label: dataUtils.mapQuizLabel(QuizType.SELECT_IN_THE_BLANKS),
  },
];

// Cột này để edit quiz lẻ
export const QuizDetailEditColumn: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const { list, setQuizType, toggleAutoAudit } = store.quizListStore;

  const thisQuiz = list[selectedIndex];

  function getQuizFormComponent() {
    switch (thisQuiz.type) {
      case QuizType.SINGLE_CHOICE:
        return <SingleChoiceForm />;
      case QuizType.MULTIPLE_CHOICES:
        return <MultipleChoicesForm />;
      case QuizType.SELECT_IN_THE_BLANKS:
        return <SelectInBlanksForm />;
      default:
        return null;
    }
  }

  return (
    <>
      {selectedIndex === -1 ? (
        <Empty description="Tạo câu hỏi hoặc chọn câu hỏi để chỉnh sửa" />
      ) : (
        <>
          <strong>{`Quiz ${selectedIndex + 1}`}</strong>
          <Form layout="vertical">
            <Form.Item label="Loại câu hỏi">
              <Select
                id="quiz-type"
                defaultValue={thisQuiz.type}
                value={thisQuiz.type}
                onChange={(x) => {
                  setTimeout(() => {
                    uiUtils.showConfirmation(
                      "Chú ý",
                      "Dữ liệu của câu hỏi hiện tại sẽ bị xoá khi chuyển loại câu hỏi, bạn có muốn đổi thật không?",
                      () => {
                        setQuizType(thisQuiz.id, x);
                      },
                      () => undefined
                    );
                  }, 300); // Delay để đỡ bị đè UI
                }}
              >
                {options.map((n) => (
                  <Option key={n.value} value={n.value}>
                    {n.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Checkbox
              checked={thisQuiz.autoAudit}
              onChange={() => toggleAutoAudit(thisQuiz.id, !thisQuiz.autoAudit)}
            >
              {"Không kiểm tra đúng sai"}
            </Checkbox>
          </Form>
          <hr />
          {getQuizFormComponent()}
        </>
      )}
    </>
  );
});
