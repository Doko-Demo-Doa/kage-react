import React from "react";
import { Space, Button, Divider, Tooltip, notification, Spin, Popover } from "antd";
import {
  FontSizeOutlined,
  PlusOutlined,
  PullRequestOutlined,
  UploadOutlined,
  FolderOpenFilled,
  PictureFilled,
  MessageOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { slideListState } from "~/atoms/slide-list-atom";

import { CalloutMatrix } from "~/components/callout-matrix/callout-matrix";
import { fileUtils } from "~/utils/utils-files";
import { audioUtils, ffmpegUtils, imageUtils } from "~/utils/utils-conversions";
import { MediaType } from "~/common/static-data";
import { emitter } from "~/services/events-helper";
import { dataUtils } from "~/utils/utils-data";
import { isElectron } from "~/utils/utils-platform";

import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar.scss";

export const SlideBuilderToolbar: React.FC = () => {
  const [slideList, setSlideList] = useRecoilState(slideListState);

  const onNewSlide = () => {
    const newSlide = {
      title: "Title here",
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
      if (fileUtils.detectMediaType(path) === MediaType.VIDEO) {
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
      } else if (fileUtils.detectMediaType(path) === MediaType.IMAGE) {
        // Image
        const resp = await imageUtils.checkImageMetadata(path);
        if (!imageUtils.isImageOptimized(resp.width, resp.height)) {
          const newImage = await imageUtils.optimizeImage(path);
          const imgUrl = `local-resource://${newImage}`;

          emitter.emit("insert-image", imgUrl);

          return;
        }
      } else if (fileUtils.detectMediaType(path) === MediaType.AUDIO) {
        audioUtils.optimizeAudio(path, (progress, filePath) => {
          console.log(progress);
          if (progress === "end") {
            // Hiển thị message báo convert
            const videoUrl = `local-resource://${filePath}`;
            emitter.emit("insert-audio", videoUrl);
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

  const onNewRichText = () => {
    emitter.emit("insert-rich-text");
  };

  const onPublish = () => {
    console.log(fileUtils.createCacheDir());
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
          onClick={() => onNewRichText()}
        />
        <Tooltip placement="bottom" title="Chèn ảnh / video">
          <Button
            type="link"
            icon={<PictureFilled />}
            size="middle"
            onClick={() => onInsertMedia()}
          />
        </Tooltip>

        <Popover content={<CalloutMatrix />}>
          <Button type="link" icon={<MessageOutlined />} size="middle" />
        </Popover>

        <Divider type="vertical" />
        <Button icon={<PullRequestOutlined />} type="primary" danger>
          Toggle Preview
        </Button>
        <Button onClick={() => onPublish()} icon={<UploadOutlined />} type="primary">
          Publish
        </Button>
        {isElectron() && (
          <Button onClick={() => onOpenCache()} icon={<FolderOpenFilled />}>
            Open Cache Folder
          </Button>
        )}

        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </Space>
    </div>
  );
};
