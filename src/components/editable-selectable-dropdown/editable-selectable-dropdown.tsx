import { useState } from "react";
import { Button, Dropdown, Menu, Radio, Input } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { Colors } from "~/common/colors";

import "~/components/editable-selectable-dropdown/editable-selectable-dropdown.scss";

interface Props {
  id: string;
  position: number;
  onChangeValue?: (idx: number, newValue: string) => void | undefined;
  onRemove?: (idx: number) => void | undefined;
  onSelectCorrectAnswer?: (idx: number) => void | undefined;
  onClickAdd?: () => void | undefined;
}

export const EditableSelectableDropdown: React.FC<Props> = () => {
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu className="editable-selectable-dropdown-menu">
      <Menu.Item key="1">
        <div className="inner">
          <Radio onChange={() => null} />
          <div className="separator" />
          <Input onChange={(e) => null} />
          <div className="separator" />
          <Button
            type="text"
            size="small"
            icon={
              <CloseCircleFilled
                style={{
                  color: Colors.PALE_RED,
                }}
              />
            }
          />
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div className="inner">
          <Radio onChange={() => null} />
          <div className="separator" />
          <Input onChange={(e) => null} />
          <div className="separator" />
          <Button
            type="text"
            size="small"
            icon={
              <CloseCircleFilled
                style={{
                  color: Colors.PALE_RED,
                }}
              />
            }
          />
        </div>
      </Menu.Item>
      <Menu.Item disabled>Clicking me will close the menu</Menu.Item>

      <Button className="add-btn">Add New option</Button>
    </Menu>
  );

  return (
    <Dropdown
      trigger={["click"]}
      onVisibleChange={(visible) => setVisible(visible)}
      visible={visible}
      overlay={menu}
    >
      <Button>Test</Button>
    </Dropdown>
  );
};
