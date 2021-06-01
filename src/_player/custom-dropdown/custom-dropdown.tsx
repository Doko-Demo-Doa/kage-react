import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { BlankMatcher } from "~/typings/types";
import { formattingUtils } from "~/utils/utils-formatting";

interface Props {
  id: string;
  matchers: BlankMatcher[];
  onSelect?: () => void | undefined;
}

export const CustomDropdown: React.FC<Props> = ({ matchers, id }) => {
  const [selected, setSelected] = useState<string | number>("");
  const thisMatcher = matchers.find((n) => n.id === id);

  console.log(selected);

  const menu = (
    <Menu className="editable-selectable-dropdown-menu" onClick={(e) => setSelected(e.key)}>
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
