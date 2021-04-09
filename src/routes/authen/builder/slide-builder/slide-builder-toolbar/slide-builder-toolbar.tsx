import React from "react";
import { Space, Button, Divider } from "antd";
import { FontSizeOutlined, PlusOutlined, PullRequestOutlined, UploadOutlined, PictureFilled, MessageOutlined } from "@ant-design/icons";

import "./slide-builder-toolbar.scss";

export const SlideBuilderToolbar: React.FC = () => {
  return (
    <div className="slide-builder-toolbar">
      <Space>
        <Button icon={<PlusOutlined />} type="primary" ghost>New Slide</Button>
        <Button type="link" icon={<FontSizeOutlined />} size="middle" />
        <Button type="link" icon={<PictureFilled />} size="middle" />
        <Button type="link" icon={<MessageOutlined />} size="middle" />
        <Divider type="vertical" />
        <Button icon={<PullRequestOutlined />} type="primary" danger>Toggle Preview</Button>
        <Button icon={<UploadOutlined />} type="primary">Publish</Button>
      </Space>
    </div>
  );
};
