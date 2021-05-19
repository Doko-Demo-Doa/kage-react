import React, { useContext } from "react";
import { Select, Form, Empty } from "antd";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";
import { QuizType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";

import { SingleChoiceForm } from "~/routes/authen/builder/quiz-builder/quiz-detail-edit-column/type-0-single-choice";

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
];

// Cột này để edit quiz lẻ
export const QuizDetailEditColumn: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;

  return (
    <>
      {selectedIndex === -1 ? (
        <Empty description="Tạo câu hỏi hoặc chọn câu hỏi để chỉnh sửa" />
      ) : (
        <>
          <strong>{`Quiz ${selectedIndex + 1}`}</strong>
          <Form layout="vertical">
            <Form.Item label="Loại câu hỏi">
              <Select id="quiz-type">
                {options.map((n) => (
                  <Option key={n.value} value={n.value}>
                    {n.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <hr />
          <SingleChoiceForm />
        </>
      )}
    </>
  );
});
