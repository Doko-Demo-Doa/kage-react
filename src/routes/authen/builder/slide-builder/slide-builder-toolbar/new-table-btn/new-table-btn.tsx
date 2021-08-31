import React, { useState } from "react";
import { Button, Popover } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { TableConstructor } from "~/components/table-constructor/table-constructor";

export const NewTableBtn: React.FC = observer(() => {
  const [popVisible, setPopVisible] = useState(false);

  return (
    <Popover
      visible={popVisible}
      trigger={["click"]}
      content={<TableConstructor />}
      title="Chèn bảng, bạn vui lòng chọn số hàng / cột:"
    >
      <Button
        icon={<TableOutlined />}
        type="link"
        ghost
        onClick={() => setPopVisible(!popVisible)}
      />
    </Popover>
  );
});
