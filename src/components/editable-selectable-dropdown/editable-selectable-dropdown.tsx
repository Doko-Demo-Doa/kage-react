import { useContext, useState } from "react";
import { Button, Dropdown, Menu, Radio, Input } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { observer } from "mobx-react";
import { Colors } from "~/common/colors";
import { StoreContext } from "~/mobx/store-context";
import QuizSelectInBlanksModel from "~/mobx/models/quiz-select-in-blanks";

import "~/components/editable-selectable-dropdown/editable-selectable-dropdown.scss";

interface Props {
  id: string;
  onClickAdd?: () => void | undefined;
}

export const EditableSelectableDropdown: React.FC<Props> = observer(({ id }) => {
  const [visible, setVisible] = useState(false);

  const store = useContext(StoreContext);
  const { selectedIndex } = store.quizDeckStore;
  const {
    list,
    chooseCorrectMatcher,
    addNewOptionInDropdown,
    changeChoiceLabel,
  } = store.quizListStore;

  const thisQuiz = list[selectedIndex] as QuizSelectInBlanksModel;
  const thisMatcher = thisQuiz.matchers.find((n) => n.id === id);

  const menu = (
    <Menu className="editable-selectable-dropdown-menu">
      {thisMatcher?.choices.map((n, idx) => (
        <Menu.Item key={idx}>
          <div className="inner">
            <Radio
              onChange={() => chooseCorrectMatcher(thisQuiz.id, thisMatcher.id, n.id)}
              checked={thisMatcher.correctChoice === n.id}
            />
            <div className="separator" />
            <Input
              defaultValue={n.label}
              onChange={(e) => changeChoiceLabel(thisQuiz.id, thisMatcher.id, n.id, e.target.value)}
            />
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
      ))}

      <Menu.Item disabled>{`Quiz ID: ${id}`}</Menu.Item>

      <Menu.Item>
        <Button
          className="add-btn"
          onClick={() => addNewOptionInDropdown(thisQuiz.id, thisMatcher?.id)}
        >
          Thêm lựa chọn
        </Button>
      </Menu.Item>
    </Menu>
  );

  return thisMatcher ? (
    <Dropdown
      trigger={["click"]}
      onVisibleChange={(visible) => setVisible(visible)}
      visible={visible}
      overlay={menu}
    >
      <Button>Test</Button>
    </Dropdown>
  ) : null;
});
