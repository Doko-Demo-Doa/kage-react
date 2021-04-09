import React from "react";
import { Space, Button, Divider, Tooltip, notification } from "antd";
import {
  FontSizeOutlined,
  PlusOutlined,
  SoundOutlined,
  PullRequestOutlined,
  UploadOutlined,
  PictureFilled,
  MessageOutlined
} from "@ant-design/icons";
import { useRecoilState } from "recoil";

import { fileUtils } from "~/utils/utils-files";
import { slideListState } from "~/atoms/slide-list-atom";
import "./slide-builder-toolbar.scss";
import { ffmpegUtils } from "~/utils/utils-conversions";

export const SlideBuilderToolbar: React.FC = () => {
  const [slideList, setSlideList] = useRecoilState(slideListState);

  const onNewSlide = () => {
    setSlideList([...slideList, { title: "test" }]);
  };

  const onInsertImageVideo = async () => {
    const resp = await fileUtils.selectSingleFile();
    const path = resp?.filePaths[0];
    if (path) {
      const resp = await ffmpegUtils.checkVideoMetadata(path);
      // To quá thì phải resize xuống
      if (ffmpegUtils.isTooBig(resp.width, resp.height)) {
        console.log("Too big, converting to smaller size");
        ffmpegUtils.convertToMp4(path, resp.width, (progress) => {
          console.log(progress);
          if (progress === "end") {
            // Hiển thị message báo convert
            notification.open({
              message: "Hoàn tất",
              description:
                "Video đã được chuyển về định dạng chuẩn để có thể hiển thị trên slide.",
              onClick: () => {
                console.log("Notification Clicked");
              },
            });
          }
        });
      }
      // ffmpegUtils.convertToMp4(path, (percent) => console.log(percent));
    }
  };

  const onPublish = () => {
    console.log(fileUtils.createCacheDir());
  };

  return (
    <div className="slide-builder-toolbar">
      <Space>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={() => onNewSlide()}>New Slide</Button>
        <Button type="link" icon={<FontSizeOutlined />} size="middle" />
        <Button type="link" icon={<SoundOutlined />} size="middle" />
        <Tooltip placement="bottom" title="Chèn ảnh / video">
          <Button
            type="link"
            icon={<PictureFilled />}
            size="middle"
            onClick={() => onInsertImageVideo()}
          />
        </Tooltip>
        <Button type="link" icon={<MessageOutlined />} size="middle" />
        <Divider type="vertical" />
        <Button icon={<PullRequestOutlined />} type="primary" danger>Toggle Preview</Button>
        <Button onClick={() => onPublish()} icon={<UploadOutlined />} type="primary">Publish</Button>
      </Space>
    </div>
  );
};
