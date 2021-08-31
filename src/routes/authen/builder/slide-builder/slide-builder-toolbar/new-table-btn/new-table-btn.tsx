import React, { useState } from "react";
import { Button, Popover } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { TableConstructor } from "~/components/table-constructor/table-constructor";

export const NewTableBtn: React.FC = () => {
  const [popVisible, setPopVisible] = useState(false);

  return (
    <Popover
      visible={popVisible}
      trigger={["click"]}
      content={<TableConstructor onSelect={(rowNum, colNum) => console.log(rowNum, colNum)} />}
      title="Chèn bảng, bạn vui lòng chọn số hàng / cột:"
    >
      <Button icon={<TableOutlined />} type="link" onClick={() => setPopVisible(!popVisible)} />
    </Popover>
  );
};
