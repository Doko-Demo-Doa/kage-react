import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { MenuOutlined, RightCircleFilled } from "@ant-design/icons";
import { Colors } from "~/common/colors";
import { QuizLayoutSingleChoice } from "~/_player/quiz-layouts/implementations/quiz-layout-single-choice";

import "~/_player/main-layout/main-layout.scss";

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
  return (
    <div className="main-layout">
      <div className="main-frame">
        <div className="head">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MenuOutlined />}>Danh sách câu hỏi</Button>
          </Dropdown>

          <div className="right-side">
            Câu thứ <strong>1</strong> trên tổng số <strong>13</strong>
          </div>
        </div>
        <div className="content">
          <QuizLayoutSingleChoice />
        </div>
        <div className="footer">
          <div className="left-side">
            Điểm hiện tại: <strong>233</strong>
          </div>
          <Button icon={<RightCircleFilled style={{ color: Colors.GREEN }} />}>OK</Button>
        </div>
      </div>
    </div>
  );
};
