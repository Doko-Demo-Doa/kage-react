import React, { useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { MenuOutlined, RightCircleFilled } from "@ant-design/icons";
import ScrollBar from "react-perfect-scrollbar";
import { Colors } from "~/common/colors";
import { QuizLayoutSingleChoice } from "~/_player/quiz-layouts/implementations/quiz-layout-single-choice";
import { QuizLayoutMultipleChoices } from "~/_player/quiz-layouts/implementations/quiz-layout-multiple-choices";

import sample from "~/_player/assets/quiz-sample.json";

import "~/_player/main-layout/main-layout.scss";
import { QuizType } from "~/common/static-data";

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

export const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  // const maxIndex = sample.quizzes.length;

  function getProperQuizLayout() {
    const target = sample.quizzes[activeIndex];
    if (!target) return <div />;
    if (target.type === QuizType.SINGLE_CHOICE) {
      return <QuizLayoutSingleChoice data={target} />;
    }
    if (target.type === QuizType.MULTIPLE_CHOICES) {
      return <QuizLayoutMultipleChoices data={target} />;
    }
    return <div />;
  }

  return (
    <div className="main-layout ant-row">
      <div className="main-frame ant-col-md-18 ant-col-xs-24 ant-col-md-offset-3">
        <div className="head">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MenuOutlined />}>Danh sách câu hỏi</Button>
          </Dropdown>

          <div className="right-side">
            Câu thứ <strong>1</strong> trên tổng số <strong>13</strong>
          </div>
        </div>
        <ScrollBar className="content">{getProperQuizLayout()}</ScrollBar>
        <div className="footer">
          <div className="left-side">
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
