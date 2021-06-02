import React, { useContext, useState } from "react";
import { Space, Button, Divider, Tooltip, notification, Popover } from "antd";
import {
  FontSizeOutlined,
  PlusOutlined,
  PullRequestOutlined,
  UploadOutlined,
  FolderOpenFilled,
  PictureFilled,
  MessageOutlined,
  TableOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Delta } from "quill";
import { observer } from "mobx-react";

import { TableConstructor } from "~/components/table-constructor/table-constructor";
import { fileUtils } from "~/utils/utils-files";
import { audioUtils, ffmpegUtils, imageUtils } from "~/utils/utils-conversions";
import { AppDefaults, InitialBlockCoordinate, MediaType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";
import { isElectron } from "~/utils/utils-platform";
import { uiUtils } from "~/utils/utils-ui";
import { SlideBlockType } from "~/typings/types";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar.scss";

export const SlideBuilderToolbar: React.FC = observer(() => {
  const [tableConstructorVisible, setTableConstructorVisible] = useState(false);

  const store = useContext(StoreContext);
  const { list, setList, newSlide } = store.slideListStore;
  const slideBuilderMeta = store.slideBuilderStore;

  const shouldDisable = list.length <= 0;

  const onNewSlide = () => {
    newSlide();
  };

  const onInsertMedia = async () => {
    const path = await fileUtils.selectSingleFile();
    if (path) {
      const mType = fileUtils.detectMediaType(path);
      if (mType === MediaType.VIDEO) {
        // Video
        const resp = await ffmpegUtils.checkVideoMetadata(path);
        // To quá thì phải resize xuống
        if (ffmpegUtils.isTooBig(resp.width, resp.height)) {
          console.log("Too big, converting to smaller size");
          ffmpegUtils.convertToMp4(path, resp.width, (progress, filePath) => {
            console.log(progress);
            if (progress === "end") {
              // Hiển thị message báo convert
              const videoUrl = `local-resource://${filePath}`;
              console.log(videoUrl);
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
      } else if (mType === MediaType.IMAGE) {
        // Image
        const { fileName, extension, extra } = await imageUtils.optimizeImage(path);
        insertBlock(mType, fileName, extension, extra);
        return;
      } else if (mType === MediaType.AUDIO) {
        audioUtils.optimizeAudio(path, undefined, (progress, filePath, fileName, extension) => {
          if (progress === "end") {
            // Hiển thị message báo convert
            console.log(fileName, extension);
            insertBlock(mType, fileName, extension, { width: 0, height: 0 });

            notification.open({
              message: "Hoàn tất",
              description: "Audio đã được chuyển về định dạng chuẩn để có thể đưa vào slide.",
              onClick: () => {
                console.log("Notification Clicked");
              },
            });
          }
        });
      }
    }
  };

  const onInsertTable = () => {
    insertBlock(MediaType.TABLE, "", "", { width: 0, height: 0 });
  };

  const onNewRichText = (deltaQuill: Delta | string) => {
    uiUtils.showQuillEditor(deltaQuill, (data) => {
      insertBlock(MediaType.TEXT_BLOCK, "", "", { width: 0, height: 0 }, data);
    });
  };

  const onInsertCallout = () => {
    insertBlock(MediaType.CALLOUT, "", "", { width: 200, height: 102 });
  };

  const onPublish = async () => {
    fileUtils.saveSlideJsonToCache(JSON.stringify(list, null, 2));
    const convertedStr = dataUtils.convertToHtmlSlideData(list);
    fileUtils.writeToHtml(convertedStr);

    const folderPath = await fileUtils.openFolderSaveDialog();
    if (folderPath) {
      fileUtils.copyFromCacheToDest(folderPath);
      fileUtils.copyVendorFilesToDest(folderPath);
    }
  };

  const onOpenCache = () => {
    fileUtils.openFolderBrowser(fileUtils.getCacheDirectory());
  };

  const onTogglePreview = () => {
    console.log(list);
  };

  const insertBlock = (
    type: MediaType,
    assetName: string,
    extension: string,
    { width, height }: { width: number; height: number },
    quillData?: Delta
  ) => {
    console.log("lll", width, height);
    const blockData: SlideBlockType = {
      id: dayjs().unix().toString(),
      type,
      assetName: `${assetName}.${extension}`,
      autoPlay: true,
      content: "",
      position: {
        x: InitialBlockCoordinate.x,
        y: InitialBlockCoordinate.y,
      },
      size: {
        w: width * getOptimalScale(type),
        h: height * getOptimalScale(type),
      },
      anchor: {
        x: InitialBlockCoordinate.x + 40,
        y: InitialBlockCoordinate.y + height / 2 + 90, // Dịch toạ độ điểm neo xuống dưới một chút.
      },
      deltaContent: quillData ?? undefined,
    };

    // Try not to mutate original object / array.
    const idx = slideBuilderMeta.selectedIndex;
    const newSlideArray = [...list];

    const activeSlide = { ...newSlideArray[idx] };

    const newBlocks = [...activeSlide.slideBlocks, blockData];
    activeSlide.slideBlocks = [...newBlocks];
    newSlideArray[idx] = activeSlide;

    const newArr = [...newSlideArray.slice(0, idx), activeSlide, ...newSlideArray.slice(idx + 1)];

    setList([...newArr]);
  };

  const getOptimalScale = (type: MediaType) => {
    if (type === MediaType.CALLOUT) return 1;
    return AppDefaults.DEFAULT_IMAGE_SCALE;
  };

  return (
    <div className="slide-builder-toolbar">
      <Space>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={() => onNewSlide()}>
          New Slide
        </Button>
        <Button
          type="link"
          icon={<FontSizeOutlined />}
          size="middle"
          disabled={shouldDisable}
          onClick={() => onNewRichText("")}
        />
        <Tooltip placement="bottom" title="Chèn ảnh / video">
          <Button
            type="link"
            icon={<PictureFilled />}
            size="middle"
            disabled={shouldDisable}
            onClick={() => onInsertMedia()}
          />
        </Tooltip>

        <Button
          disabled={shouldDisable}
          type="link"
          icon={<MessageOutlined />}
          size="middle"
          onClick={() => onInsertCallout()}
        />

        <Popover
          arrowContent
          trigger="click"
          destroyTooltipOnHide
          visible={tableConstructorVisible && !shouldDisable}
          onVisibleChange={(visible) => setTableConstructorVisible(visible)}
          content={
            <TableConstructor
              onSelect={(numRows, numCols) => {
                console.log(numRows, numCols);
                setTableConstructorVisible(false);
              }}
            />
          }
        >
          <Button
            disabled={shouldDisable}
            type="link"
            icon={<TableOutlined />}
            size="middle"
            onClick={() => onInsertTable()}
          />
        </Popover>

        <Divider type="vertical" />
        <Button
          onClick={() => onTogglePreview()}
          icon={<PullRequestOutlined />}
          type="primary"
          danger
        >
          Toggle Preview
        </Button>
        <Button
          disabled={shouldDisable}
          onClick={() => onPublish()}
          icon={<UploadOutlined />}
          type="primary"
        >
          Publish
        </Button>
        {isElectron() && (
          <Button onClick={() => onOpenCache()} icon={<FolderOpenFilled />}>
            Open Cache Folder
          </Button>
        )}
      </Space>
    </div>
  );
});
