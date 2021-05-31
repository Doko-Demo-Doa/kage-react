import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { QuizLayout } from "~/_player/quiz-layouts/quiz-layout";
import { formattingUtils } from "~/utils/utils-formatting";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";

interface Props {
  // TODO: Remove "any"
  data: any;
}

/**
 * Chỉ dùng đúng 1 loại component AudioPlayer để đảm bảo hiển thị tốt trên tất cả các
 * thiết bị / browser khác nhau.
 */
export const QuizLayoutSelectInBlanks: React.FC<Props> = ({ data }) => {
  return (
    <QuizLayout
      content={
        <div className="quiz-layout-inner quiz-layout-select-in-blanks">
          {data.audioLink && (
            <CustomAudioPlayer
              autoPlay={false}
              src={data.audioLink}
              style={{ width: "60%", userSelect: "none" }}
            />
          )}

          <img className="irasutoya" src={data.imageLink} />

          <div className="naiyou">
            <div className="content">
              {formattingUtils
                .replaceData(data.content ?? "")
                .with((key) => {
                  const menu = (
                    <Menu>
                      <Menu.Item key="1">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.antgroup.com"
                        >
                          1st menu item
                        </a>
                      </Menu.Item>
                      <Menu.Item key="2">
                        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                          2nd menu item
                        </a>
                      </Menu.Item>
                    </Menu>
                  );
                  return (
                    <Dropdown trigger={["click"]} overlay={menu} key={key}>
                      <Button>Test</Button>
                    </Dropdown>
                  );
                })
                .map((elem: string | React.ReactNode) => {
                  if (React.isValidElement(elem)) {
                    return React.cloneElement(elem);
                  }
                  if (typeof elem === "string") {
                    return formattingUtils.htmlToJSX(elem);
                  }
                })}
            </div>
          </div>
        </div>
      }
    />
  );
};
