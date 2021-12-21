import React from "react";
import { Result, Button, List, Typography, Space, Progress } from "antd";
import { CompressOutlined, FileZipFilled } from "@ant-design/icons";
import { FileNameWithPathType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { dataUtils } from "~/utils/utils-data";
import { commonHelper } from "~/common/helper";
import { SLIDE_HTML_ENTRY_FILE, SLIDE_MANIFEST_FILE } from "~/common/static-data";

import CssColors from "~/assets/styles/_colors.module.scss";
import "~/components/mass-fixer/mass-fixer.scss";

export const MassFixerComponent: React.FC = () => {
  const [queue, setQueue] = React.useState<FileNameWithPathType[]>([]);
  const [progress, setProgress] = React.useState(0);

  async function chooseFolder() {
    const path = await fileUtils.launchFolderOpenDialog();
    if (path) {
      const archives = fileUtils.scanForSlideArchivesIn(path);
      setQueue(archives);
    }
  }

  function startFixing() {
    setProgress(0);

    queue.forEach((n, idx) => {
      // Ver "0.1.14", fix file manifest.json
      const slideData = fileUtils.readZipEntryManifest(n.path);
      const newData = commonHelper.prepareExportData(slideData.layout, slideData.id);

      const manifestBuffer = Buffer.from(newData, "utf-8");
      fileUtils.writeEntryIntoZip(n.path, SLIDE_MANIFEST_FILE, manifestBuffer);

      const newHtmlData = dataUtils.convertToHtmlSlideData(slideData.layout, false);
      const htmlBufer = Buffer.from(newHtmlData, "utf-8");
      fileUtils.writeEntryIntoZip(n.path, SLIDE_HTML_ENTRY_FILE, htmlBufer);

      // Ver "0.1.22", fix folder backgrounds (cho ra ngoài)

      setProgress((idx + 1) * (100 / queue.length));
    });
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
              <List.Item>
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

          <br />
          <br />

          <Progress percent={progress} />

          <br />
          <br />
          <br />

          <Space>
            <Button type="ghost" onClick={() => chooseFolder()}>
              Chọn thư mục khác
            </Button>
            <Button type="primary" onClick={() => startFixing()}>
              Bắt đầu sửa
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};
