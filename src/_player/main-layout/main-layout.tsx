import React, { useContext } from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { MenuOutlined, RightCircleFilled, ClockCircleFilled } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { Colors } from "~/common/colors";
import { QuizType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";
import { formattingUtils } from "~/utils/utils-formatting";
import { EventBus } from "~/services/events-helper";
import { QuizListItem } from "~/_player/main-layout/quiz-list-item/quiz-list-item";

import { QuizPlayerContext } from "~/mobx/quiz-player";

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

export const MainLayout: React.FC = observer(() => {
  const { activeIndex, nextPage, toPage, showModal, clock, clockRunning } = useContext(
    QuizPlayerContext
  );

  const menu = (
    <Menu>
      <Menu.Item key="goback" disabled>
        <Button type="primary" onClick={() => toPage(-1)}>
          Về trang hướng dẫn
        </Button>
      </Menu.Item>
      <Menu.Item key="head" disabled>
        <QuizListItem isHead />
      </Menu.Item>
      {sample.quizzes.map((n: QuizModel, idx: number) => {
        const qType = n.type as QuizType;
        return (
          <Menu.Item key={n.id} onClick={() => toPage(idx)}>
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function nextButtonLabel() {
    // if ()
  }

  return (
    <div className="main-layout ant-row">
      <div className="main-frame ant-col-md-18 ant-col-xs-24 ant-col-md-offset-3">
        <div className="head">
          {activeIndex >= 0 ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button icon={<MenuOutlined />}>Danh sách câu hỏi</Button>
            </Dropdown>
          ) : (
            <div />
          )}

          <div className="right-side" onClick={() => showModal("incorrect")}>
            Câu <strong>1</strong> / <strong>13</strong>
          </div>
        </div>
        <>
          {getProperQuizLayout()}

          <div className="footer">
            <div className="left-side" />

            <Space direction="horizontal">
              {clockRunning && (
                <div className="clock">
                  <ClockCircleFilled style={{ color: Colors.PALE_RED }} />{" "}
                  <span>{formattingUtils.secondsToMinsAndSeconds(clock)}</span>
                </div>
              )}
              <Button
                onClick={() => {
                  if (activeIndex >= 0) {
                    EventBus.emit("NEXT_CLICK");
                    return;
                  } else {
                    nextPage();
                  }
                }}
                icon={<RightCircleFilled style={{ color: Colors.GREEN }} />}
              >
                {activeIndex <= sample.quizzes.length ? "Tiếp theo" : "Kết thúc"}
              </Button>
            </Space>
          </div>
        </>
      </div>
    </div>
  );
});
