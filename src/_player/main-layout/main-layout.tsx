import React, { useState } from "react";
import { Button, Dropdown, Menu, Modal } from "antd";
import { MenuOutlined, RightCircleFilled } from "@ant-design/icons";
import ScrollBar from "react-perfect-scrollbar";
import { Colors } from "~/common/colors";
import { QuizType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";
import { ResultNotification } from "~/_player/result-notification/result-notification";
import { QuizListItem } from "~/_player/main-layout/quiz-list-item/quiz-list-item";

import QuizSingleChoiceModel from "~/mobx/models/quiz-single-choice";
import QuizMultipleChoicesModel from "~/mobx/models/quiz-multiple-choices";
import QuizModel from "~/mobx/models/quiz";

import { QuizIntro } from "~/_player/quiz-intro/quiz-intro";
import { QuizInstruction } from "~/_player/quiz-instruction/quiz-instruction";
import { QuizLayoutSingleChoice } from "~/_player/quiz-layouts/implementations/quiz-layout-single-choice";
import { QuizLayoutMultipleChoices } from "~/_player/quiz-layouts/implementations/quiz-layout-multiple-choices";
import { QuizLayoutSelectInBlanks } from "~/_player/quiz-layouts/implementations/quiz-layout-select-in-blanks";

import { ResultPreview } from "~/routes/authen/builder/quiz-builder/result-preview/result-preview";

const sample = require("~/_player/assets/quiz-sample.json");

import "~/_player/main-layout/main-layout.scss";

export const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(-2);

  const menu = (
    <Menu>
      <Menu.Item key="head" disabled>
        <Button type="primary" onClick={() => setActiveIndex(-1)}>
          Về trang hướng dẫn
        </Button>
      </Menu.Item>
      <Menu.Item key="head" disabled>
        <QuizListItem isHead />
      </Menu.Item>
      {sample.quizzes.map((n: QuizModel, idx: number) => {
        const qType = n.type as QuizType;
        return (
          <Menu.Item key={n.id} onClick={() => setActiveIndex(idx)}>
            <QuizListItem type={qType} score={23} tagline={dataUtils.mapQuizLabel(qType)} />
          </Menu.Item>
        );
      })}
    </Menu>
  );

  /**
   * Quy ước: Index -2 là mở đầu, index -1 là hướng dẫn làm bài.
   * Từ 0 trở đi là quiz
   * @returns Component tương ứng
   */
  function getProperQuizLayout() {
    if (activeIndex === -2) {
      return <QuizIntro id={sample.id} />;
    }
    if (activeIndex === -1) {
      return <QuizInstruction instruction={sample.instruction} example={sample.example} />;
    }

    if (activeIndex === sample.quizzes.length) {
      return <ResultPreview />;
    }

    const target = sample.quizzes[activeIndex];
    if (!target) return <div />;
    if (target.type === QuizType.SINGLE_CHOICE) {
      const t = target as QuizSingleChoiceModel;
      return <QuizLayoutSingleChoice data={t} />;
    }
    if (target.type === QuizType.MULTIPLE_CHOICES) {
      const t = target as QuizMultipleChoicesModel;
      return <QuizLayoutMultipleChoices data={t} />;
    }
    if (target.type === QuizType.SELECT_IN_THE_BLANKS) {
      return <QuizLayoutSelectInBlanks data={target} />;
    }
    return <div />;
  }

  function showModal() {
    Modal.confirm({
      title: "",
      icon: <div />,
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
            {activeIndex <= sample.quizzes.length ? "Tiếp theo" : "Kết thúc"}
          </Button>
        </div>
      </div>
    </div>
  );
};
