import React from "react";
import { Result, Button, Table } from "antd";

import "~/routes/authen/builder/quiz-builder/result-preview/result-preview.scss";
import { ColumnsType } from "antd/lib/table";
import { formattingUtils } from "~/utils/utils-formatting";

type ColumnMold = {
  key: string;
  no: string;
  question: string;
  result: string;
};

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
    render: (value, record) => {
      return <h3>{formattingUtils.furiganaToJSX(value)}</h3>;
    },
  },
  {
    title: "Kết quả",
    dataIndex: "result",
    key: "result",
  },
];

export const ResultPreview: React.FC = () => {
  return (
    <div className="result-preview">
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
};
