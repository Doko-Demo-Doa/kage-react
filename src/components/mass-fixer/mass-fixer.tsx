import React from "react";
import { Result, Button, List, Typography, Space, Progress } from "antd";
import { CompressOutlined, FileZipFilled, CheckCircleFilled } from "@ant-design/icons";
import { FileNameWithPathType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import CssColors from "~/assets/styles/_colors.module.scss";

import "~/components/mass-fixer/mass-fixer.scss";

export const MassFixerComponent: React.FC = () => {
  const [queue, setQueue] = React.useState<FileNameWithPathType[]>([]);

  async function chooseFolder() {
    const path = await fileUtils.launchFolderOpenDialog();
    console.log("aaa", path);
    if (path) {
      const archives = fileUtils.scanForSlideArchivesIn(path);
      console.log(archives);
      setQueue(archives);
    }
  }

  return (
    <div className="fixer-component">
      {queue.length <= 0 ? (
        <Result
          icon={<CompressOutlined />}
          title="Nâng cấp / sửa lỗi slide hàng loạt"
          subTitle='Đây là chức năng nâng cấp / sửa lỗi slide hàng loạt trong một folder.
        Click vào nút bên dưới để chọn thư mục, sau đó chương trình sẽ tự quét các file ".zip" hoặc ".dsa".'
          extra={
            <Button type="primary" onClick={() => chooseFolder()}>
              Chọn thư mục chứa bộ slide
            </Button>
          }
        />
      ) : (
        <div className="queue-list-wrapper">
          <Typography.Title level={3}>Danh sách các file được tìm thấy:</Typography.Title>

          <List
            itemLayout="horizontal"
            dataSource={queue}
            renderItem={(item) => (
              <List.Item
                extra={<CheckCircleFilled style={{ fontSize: 20, color: CssColors.colorGreen }} />}
              >
                <List.Item.Meta
                  avatar={<FileZipFilled style={{ color: CssColors.colorOrange }} />}
                  title={<div>{item.filename}</div>}
                  description={
                    <>
                      <div>{item.path}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />

          <Progress percent={70} />

          <br />
          <br />
          <br />

          <Space>
            <Button type="ghost" onClick={() => chooseFolder()}>
              Chọn thư mục khác
            </Button>
            <Button type="primary" onClick={() => chooseFolder()}>
              Bắt đầu sửa
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};
