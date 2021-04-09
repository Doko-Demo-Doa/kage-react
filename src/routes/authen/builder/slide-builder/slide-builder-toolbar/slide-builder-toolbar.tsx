import React from "react";
import { Space, Button, Divider } from "antd";
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

export const SlideBuilderToolbar: React.FC = () => {
  const [slideList, setSlideList] = useRecoilState(slideListState);

  const onNewSlide = () => {
    setSlideList([...slideList, { title: "test" }]);
  };

  const onPublish = () => {
    console.log(fileUtils.getWorkingDirectory());
  };

  return (
    <div className="slide-builder-toolbar">
      <Space>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={() => onNewSlide()}>New Slide</Button>
        <Button type="link" icon={<FontSizeOutlined />} size="middle" />
        <Button type="link" icon={<SoundOutlined />} size="middle" />
        <Button type="link" icon={<PictureFilled />} size="middle" />
        <Button type="link" icon={<MessageOutlined />} size="middle" />
        <Divider type="vertical" />
        <Button icon={<PullRequestOutlined />} type="primary" danger>Toggle Preview</Button>
        <Button onClick={() => onPublish()} icon={<UploadOutlined />} type="primary">Publish</Button>
      </Space>
    </div>
  );
};
