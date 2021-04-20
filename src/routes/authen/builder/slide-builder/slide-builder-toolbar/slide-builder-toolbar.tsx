import React from "react";
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
import { useRecoilState } from "recoil";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";

import { CalloutMatrix } from "~/components/callout-matrix/callout-matrix";
import { fileUtils } from "~/utils/utils-files";
import { audioUtils, ffmpegUtils, imageUtils } from "~/utils/utils-conversions";
import { AppDefaults, InitialBlockCoordinate, MediaType } from "~/common/static-data";
import { emitter } from "~/services/events-helper";
import { dataUtils } from "~/utils/utils-data";
import { isElectron } from "~/utils/utils-platform";
import { SlideBlockType } from "~/typings/types";

import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar.scss";

export const SlideBuilderToolbar: React.FC = () => {
  const [slideList, setSlideList] = useRecoilState(slideListState);
  const [slideBuilderMeta] = useRecoilState(slideBuilderState);

  const shouldDisable = slideList.length <= 0;

  const onNewSlide = () => {
    const newSlide = {
      title: "",
      slideBlocks: [],
      steps: [],
    };
    if (slideList.length <= 0) {
      setSlideList([newSlide]);
      return;
    }

    const newSlideArray = [...slideList, newSlide];
    setSlideList(newSlideArray);
    // Ghi vào file json.
    dataUtils.saveSlideJsonToCache(JSON.stringify(newSlideArray, null, 2));
  };

  const onInsertMedia = async () => {
    const resp = await fileUtils.selectSingleFile();
    const path = resp?.filePaths[0];
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
              emitter.emit("insert-image", videoUrl);
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
        audioUtils.optimizeAudio(path, (progress, filePath, fileName, extension) => {
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

  const insertBlock = (
    type: MediaType,
    assetName: string,
    extension: string,
    { width, height }: { width: number; height: number }
  ) => {
    const blockData: SlideBlockType = {
      id: assetName,
      type,
      assetName: `${assetName}.${extension}`,
      autoPlay: false,
      content: "",
      position: {
        x: InitialBlockCoordinate.x,
        y: InitialBlockCoordinate.y,
      },
      size: {
        w: width * AppDefaults.DEFAULT_IMAGE_SCALE,
        h: height * AppDefaults.DEFAULT_IMAGE_SCALE,
      },
    };

    // Try not to mutate original object / array.
    const idx = slideBuilderMeta.selectedIndex;
    const newSlideArray = [...slideList];

    const activeSlide = { ...newSlideArray[idx] };

    const newBlocks = [...activeSlide.slideBlocks, blockData];
    activeSlide.slideBlocks = [...newBlocks];
    newSlideArray[idx] = activeSlide;

    const newArr = [...newSlideArray.slice(0, idx), activeSlide, ...newSlideArray.slice(idx + 1)];

    setSlideList([...newArr]);
  };

  const onNewRichText = () => {
    emitter.emit("insert-rich-text");
  };

  const onPublish = () => {
    const convertedStr = dataUtils.convertToHtmlSlideData(slideList);
    dataUtils.writeToHtml(convertedStr);
  };

  const onOpenCache = () => {
    fileUtils.openFolderBrowser(fileUtils.getCacheDirectory());
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
          onClick={() => onNewRichText()}
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

        <Popover
          arrowContent
          visible={!shouldDisable ? undefined : false}
          content={<CalloutMatrix />}
        >
          <Button disabled={shouldDisable} type="link" icon={<MessageOutlined />} size="middle" />
        </Popover>

        <Button
          disabled={shouldDisable}
          type="link"
          icon={<TableOutlined />}
          size="middle"
          onClick={() => onInsertTable()}
        />

        <Divider type="vertical" />
        <Button icon={<PullRequestOutlined />} type="primary" danger>
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
};
