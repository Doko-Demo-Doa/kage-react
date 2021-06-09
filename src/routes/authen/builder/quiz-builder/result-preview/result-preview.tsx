import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Result } from "antd";
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { QuizPlayerContext } from "~/mobx/quiz-player";

import "~/routes/authen/builder/quiz-builder/result-preview/result-preview.scss";
import { QResult } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";
import { Colors } from "~/common/colors";

export const ResultPreview: React.FC = observer(() => {
  const { results, quizzes } = useContext(QuizPlayerContext);

  console.log(JSON.parse(JSON.stringify(results)));

  return (
    <div className="content result-preview">
      <Result
        status="success"
        title="Chúc mừng, bạn đã làm tương đối tốt!"
        subTitle={
          <div>
            Điểm số của bạn là <strong>9/10</strong>
          </div>
        }
        extra={[]}
      />

      <div className="result-table">
        {quizzes.map((n, idx) => {
          return (
            <ResultItem
              key={n.id}
              idx={idx + 1}
              label={dataUtils.mapQuizLabel(n.type)}
              result={results[idx].judge}
            />
          );
        })}
      </div>
    </div>
  );
});

type ItemProps = {
  idx: number;
  label: string;
  result: QResult;
};

const ResultItem: React.FC<ItemProps> = ({ idx, label, result }) => {
  function mapIcon() {
    if (result === "correct") {
      return <CheckCircleFilled style={{ color: Colors.GREEN }} />;
    }
    if (result === "incorrect") {
      return <CloseCircleFilled style={{ color: Colors.PALE_RED }} />;
    }
    if (result === "mixed") {
      return <ExclamationCircleFilled style={{ color: Colors.BUTTERSCOTCH }} />;
    }
  }

  return (
    <div className="result-item">
      <div className="col1">{idx}</div>
      <div className="col2">{label}</div>
      <div className="col3">{mapIcon()}</div>
    </div>
  );
};
