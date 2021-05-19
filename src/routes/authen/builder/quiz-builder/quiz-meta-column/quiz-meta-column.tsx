import React, { useContext } from "react";
import { Input, Form, InputNumber } from "antd";
import { observer } from "mobx-react";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/quiz-builder/quiz-meta-column/quiz-meta-column.scss";

export const QuizMetaColumn: React.FC = observer(() => {
  const store = useContext(StoreContext);
  const {
    instruction,
    passingScore,
    setDeckName,
    setInstruction,
    setPassingScore,
  } = store.quizDeckStore;

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Tên bộ quiz">
          <Input
            maxLength={64}
            placeholder="Tên bộ quiz"
            onChange={(e) => setDeckName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Hướng dẫn">
          <Input.TextArea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Hướng dẫn làm bài"
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
            maxLength={120}
          />
        </Form.Item>

        <div className="max-score">
          <InputNumber
            id="maximum-score"
            onChange={(e) => setPassingScore(e)}
            placeholder="Điểm tối đa"
            className="max-score-input"
            defaultValue={passingScore}
            min={1}
            max={100}
          />
          <div className="lbl">Tối đa: 100</div>
        </div>
      </Form>
    </>
  );
});
