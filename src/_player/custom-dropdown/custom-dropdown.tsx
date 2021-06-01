import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { BlankMatcher } from "~/typings/types";
import { formattingUtils } from "~/utils/utils-formatting";

interface Props {
  id: string;
  matchers: BlankMatcher[];
  onSelect?: (key: string) => void | undefined;
}

export const CustomDropdown: React.FC<Props> = ({ matchers, id, onSelect }) => {
  const [selected, setSelected] = useState<string | number>("");
  const thisMatcher = matchers.find((n) => n.id === id);

  const menu = (
    <Menu
      className="editable-selectable-dropdown-menu"
      onClick={(e) => {
        onSelect?.(e.key);
        setSelected(e.key);
      }}
    >
      {thisMatcher?.choices.map((n) => (
        <Menu.Item key={n.id}>
          <h3>{formattingUtils.furiganaToJSX(n.label)}</h3>
        </Menu.Item>
      ))}
    </Menu>
  );

  return thisMatcher ? (
    <Dropdown trigger={["click"]} overlay={menu}>
      <Button size="middle">
        {formattingUtils.furiganaToJSX(thisMatcher.choices.find((n) => n.id === selected)?.label) ||
          "-----"}
      </Button>
    </Dropdown>
  ) : null;
};
