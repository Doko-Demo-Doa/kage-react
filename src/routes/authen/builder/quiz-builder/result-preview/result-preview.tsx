import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Result, Button, Table } from "antd";
import { formattingUtils } from "~/utils/utils-formatting";
import { QuizPlayerContext } from "~/mobx/quiz-player";

import { ColumnsType } from "antd/lib/table";

import "~/routes/authen/builder/quiz-builder/result-preview/result-preview.scss";

type ColumnMold = {
  key: string;
  no: string;
  question: string;
  result: string;
};

const columns: ColumnsType<ColumnMold> = [
  {
    title: "Câu số",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "Câu hỏi",
    dataIndex: "question",
    key: "question",
    render: (value) => {
      return <h3>{formattingUtils.furiganaToJSX(value)}</h3>;
    },
  },
  {
    title: "Kết quả",
    dataIndex: "result",
    key: "result",
  },
];

export const ResultPreview: React.FC = observer(() => {
  const { onSubmit } = useContext(QuizPlayerContext);

  const dataSource = [
    {
      key: "1",
      no: "1",
      question: "{今日(きょう)}なにを食べる",
      result: "Đúng",
    },
    {
      key: "2",
      no: "2",
      question: "sdfdsfdsfdsfdsfdsfdsfsdf",
      result: "10 Downing Street",
    },
  ];

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
        extra={[
          <Button type="primary" key="console">
            Xem kết quả chi tiết
          </Button>,
        ]}
      />

      <div className="result-table">
        <Table pagination={false} dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
});
