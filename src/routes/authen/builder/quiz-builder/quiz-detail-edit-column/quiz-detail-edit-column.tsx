import React from "react";
import { Select, Form } from "antd";
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

export const QuizDetailEditColumn: React.FC = () => {
  return (
    <>
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
  );
};
