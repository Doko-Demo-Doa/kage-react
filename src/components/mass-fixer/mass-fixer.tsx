import React from "react";
import { Result, Button, List, Typography, Space, Progress, Badge } from "antd";
import { CompressOutlined, FileZipFilled } from "@ant-design/icons";
import { uniq } from "rambdax";
import { FileNameWithPathType, ManifestLayout, SlideType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { dataUtils } from "~/utils/utils-data";
import { commonHelper } from "~/common/helper";
import { validationUtils } from "~/utils/utils-validation";
import { BREAKING_CHANGE_VERSIONS } from "~/common/static-data";

import CssColors from "~/assets/styles/_colors.module.scss";
import "~/components/mass-fixer/mass-fixer.scss";
import { Colors } from "~/common/colors";

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

  function getAssetList(slides: SlideType[]) {
    let assetList: string[] = [];
    slides.forEach((item) => {
      const assetItems = item.slideBlocks.map((n) => n.assetName || "").filter((n) => n !== ".");
      assetList = [...assetList, ...assetItems];
    });
    return assetList;
  }

  function startFixing() {
    setProgress(0);

    asyncForEach(queue, async (n, idx) => {
      const slideData: ManifestLayout = fileUtils.readZipEntryManifest(n.path);
      const ver = n.exportedFrom || "";

      const newData = commonHelper.prepareExportData(slideData.layout, slideData.id);
      const newHtmlData = dataUtils.convertToHtmlSlideData(slideData.layout, false);

      if (validationUtils.compareVersion("0.1.22", ver)) {
        /// Ver "0.1.22", fix folder backgrounds (cho ra ngoài)
        const assetList = getAssetList(slideData.layout);

        // Lọc background
        const backgroundAssetList = slideData.layout.map((n) => n.background || "").filter(Boolean);

        await fileUtils.reconstructZipTo(n.path, n.path, {
          assets: assetList,
          backgrounds: uniq(backgroundAssetList),
          manifestData: newData,
          htmlData: newHtmlData,
        });
      }

      setProgress(parseFloat(((idx + 1) * (100 / queue.length)).toFixed(1)));
    });
  }

  function shouldFix(ver?: string): string {
    const found = BREAKING_CHANGE_VERSIONS.find((n) => {
      return validationUtils.compareVersion(n.ver, ver || "");
    });
    if (found) {
      return found.note;
    }
    return "";
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
                  description={<div>{item.path}</div>}
                />

                <Badge
                  color={!shouldFix(item.exportedFrom) ? Colors.EMERALD : Colors.PALE_RED}
                  text={
                    <Typography.Text italic type="secondary">
                      {shouldFix(item.exportedFrom) || "Phiên bản này không cần sửa"}
                    </Typography.Text>
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

export async function asyncForEach<T>(
  array: Array<T>,
  callback: (item: T, index: number, arr: Array<T>) => void
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
