import React, { useState } from "react";
import { Button, Dropdown, Menu, Modal } from "antd";
import { MenuOutlined, RightCircleFilled } from "@ant-design/icons";
import ScrollBar from "react-perfect-scrollbar";
import { Colors } from "~/common/colors";
import { QuizType } from "~/common/static-data";
import { ResultNotification } from "~/_player/result-notification/result-notification";
import { QuizListItem } from "~/_player/main-layout/quiz-list-item/quiz-list-item";

import { QuizLayoutSingleChoice } from "~/_player/quiz-layouts/implementations/quiz-layout-single-choice";
import { QuizLayoutMultipleChoices } from "~/_player/quiz-layouts/implementations/quiz-layout-multiple-choices";
import { QuizLayoutSelectInBlanks } from "~/_player/quiz-layouts/implementations/quiz-layout-select-in-blanks";

import sample from "~/_player/assets/quiz-sample.json";

import "~/_player/main-layout/main-layout.scss";

const menu = (
  <Menu>
    <Menu.Item key="0" disabled>
      <QuizListItem isHead />
    </Menu.Item>
    <Menu.Item key="1">
      <QuizListItem />
    </Menu.Item>
    <Menu.Item key="2">
      <QuizListItem />
    </Menu.Item>
  </Menu>
);

export const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  function getProperQuizLayout() {
    const target = sample.quizzes[activeIndex];
    if (!target) return <div />;
    if (target.type === QuizType.SINGLE_CHOICE) {
      return <QuizLayoutSingleChoice data={target} />;
    }
    if (target.type === QuizType.MULTIPLE_CHOICES) {
      return <QuizLayoutMultipleChoices data={target} />;
    }
    if (target.type === QuizType.SELECT_IN_THE_BLANKS) {
      return <QuizLayoutSelectInBlanks data={target} />;
    }
    return <div />;
  }

  function showModal() {
    Modal.confirm({
      title: "",
      icon: <div></div>,
      content: <ResultNotification isCorrect />,
      onOk() {
        //
      },
      onCancel: undefined,
      cancelButtonProps: { style: { display: "none" } },
    });
  }

  return (
    <div className="main-layout ant-row">
      <div className="main-frame ant-col-md-18 ant-col-xs-24 ant-col-md-offset-3">
        <div className="head">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MenuOutlined />}>Danh sách câu hỏi</Button>
          </Dropdown>

          <div className="right-side">
            Câu <strong>1</strong> / <strong>13</strong>
          </div>
        </div>
        <ScrollBar className="content">{getProperQuizLayout()}</ScrollBar>
        <div className="footer">
          <div className="left-side" onClick={() => showModal()}>
            Điểm hiện tại: <strong>233</strong>
          </div>
          <Button
            onClick={() => setActiveIndex(activeIndex + 1)}
            icon={<RightCircleFilled style={{ color: Colors.GREEN }} />}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
