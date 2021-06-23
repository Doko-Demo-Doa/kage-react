import React, { useContext, useState } from "react";
import { Button, Divider, Tooltip, notification, Space } from "antd";
import {
  FontSizeOutlined,
  PlusOutlined,
  PullRequestOutlined,
  UploadOutlined,
  FolderOpenFilled,
  PictureFilled,
  ImportOutlined,
  FileZipOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { uniq } from "rambdax";
import { Delta } from "quill";
import { observer } from "mobx-react";

import { NewQuizSetBtn } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/new-quiz-set-btn/new-quiz-set-btn";
import { fileUtils } from "~/utils/utils-files";
import { audioUtils, ffmpegUtils, imageUtils } from "~/utils/utils-conversions";
import { AppDefaults, InitialBlockCoordinate, MediaType } from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";
import { isElectron } from "~/utils/utils-platform";
import { uiUtils } from "~/utils/utils-ui";
import { commonHelper } from "~/common/helper";
import { Colors } from "~/common/colors";
import { SlideBlockType } from "~/typings/types";
import { StoreContext } from "~/mobx/store-context";

import { NewWindowShell } from "~/components/new-window-shell/new-window-shell";

import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar.scss";

export const SlideBuilderToolbar: React.FC = observer(() => {
  const [isPreview, setPreview] = useState(false);

  const store = useContext(StoreContext);
  const { list, setList, newSlide, importSlideTree } = store.slideListStore;
  const slideBuilderMeta = store.slideBuilderStore;

  const shouldDisable = list.length <= 0;

  const onNewSlide = () => {
    newSlide();
    if (list.length) {
      slideBuilderMeta.setIndex(0);
    }
  };

  const onInsertMedia = async () => {
    const path = await fileUtils.selectSingleFile();
    if (path) {
      const mType = fileUtils.detectMediaType(path);
      if (mType === MediaType.VIDEO) {
        // Video
        const resp = await ffmpegUtils.checkVideoMetadata(path);
        ffmpegUtils.optimizeVideo(
          path,
          resp.width,
          (progress, filePath, fileName, extension, ratio) => {
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

              const newW = Math.floor(resp.width * (ratio / 100));
              const newH = Math.floor(resp.height * (ratio / 100));

              insertBlock(mType, fileName, extension, { width: newW, height: newH });
            }
          }
        );
      } else if (mType === MediaType.IMAGE) {
        // Image
        const { fileName, extension, extra } = await imageUtils.optimizeImage(path);
        insertBlock(mType, fileName, extension, extra);
        return;
      } else if (mType === MediaType.AUDIO) {
        audioUtils.optimizeAudio(path, undefined, (progress, filePath, fileName, extension) => {
          if (progress === "end") {
            // Hiển thị message báo convert
            insertBlock(mType, fileName, extension, { width: 0, height: 0 });

            notification.open({
              message: "Hoàn tất",
              description: "Audio đã được chuyển về định dạng chuẩn để có thể đưa vào slide.",
            });
          }
        });
      }
    }
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
    const assetList = updateDataToCache();

    const folderPath = await fileUtils.openFolderSaveDialog();
    if (folderPath) {
      fileUtils.copyFromCacheToDest(folderPath, assetList);
    }
  };

  const onImportZip = async () => {
    const path = await fileUtils.openFileDialog();
    if (path) {
      const zipContent = fileUtils.readZipEntries(path);
      if (zipContent?.includes("slide.html") && zipContent.includes("manifest.json")) {
        // TODO: Có thể xem xét cách khác để verify file zip này không.
        // Hiện chỉ mới check 2 file trên nếu ok thì triển.
        const manifest = fileUtils.extractZipToCache(path);
        // Sau khi extract thì nạp vào bộ nhớ.
        if (manifest) {
          // Nạp manifest mới vào.
          const data = JSON.parse(manifest);
          slideBuilderMeta.importMeta(data.id);
          importSlideTree(data.layout);
          slideBuilderMeta.setIndex(0);
        }
      }
    }
  };

  const onExportZip = async () => {
    const assetList = updateDataToCache();
    const path = await fileUtils.openFolderSaveDialog();
    if (path) {
      fileUtils.zipFilesTo(path, ...assetList);
    }
  };

  const onOpenCache = () => {
    fileUtils.openFolderBrowser(fileUtils.getCacheDirectory());
  };

  const onTogglePreview = () => {
    updateDataToCache();
    setPreview(true);
  };

  const updateDataToCache = () => {
    let assetList: string[] = [];
    list.forEach((item) => {
      const assetItems = item.slideBlocks.map((n) => n.assetName || "");
      assetList = [...assetList, ...assetItems];
    });

    fileUtils.saveSlideJsonToCache(commonHelper.prepareExportData(list));
    const convertedStr = dataUtils.convertToHtmlSlideData(list);
    fileUtils.writeToHtml(convertedStr);

    return [...uniq(assetList)];
  };

  const insertBlock = (
    type: MediaType,
    assetName: string,
    extension: string,
    { width, height }: { width: number; height: number },
    quillData?: Delta
  ) => {
    const blockData: SlideBlockType = {
      id: dataUtils.generateShortUid(),
      type,
      assetName: `${assetName}.${extension}`,
      autoPlay: true,
      content: "",
      bgColor: Colors.LIGHT_GREY,
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
    <>
      {isPreview && (
        <NewWindowShell onClose={() => setPreview(false)}>
          <webview
            autoFocus
            src={`${fileUtils.getRawCacheUrl()}/slide.html`}
            style={{ width: "100%", height: "100%" }}
            allowFullScreen
          />
        </NewWindowShell>
      )}

      <div className="slide-builder-toolbar">
        <Space>
          <Button icon={<PlusOutlined />} type="primary" ghost onClick={() => onNewSlide()} />
          <NewQuizSetBtn />
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

          <Divider type="vertical" />
          <Button
            onClick={() => onTogglePreview()}
            icon={<PullRequestOutlined />}
            type="primary"
            danger
            aria-label="Bật / tắt xem thử"
          />
          <Button
            disabled={shouldDisable}
            onClick={() => onPublish()}
            icon={<UploadOutlined />}
            type="primary"
          >
            Xuất ra file
          </Button>
          <Button
            onClick={() => onImportZip()}
            style={{ backgroundColor: Colors.INDIGO, borderColor: Colors.INDIGO }}
            icon={<ImportOutlined />}
            type="primary"
            aria-label="Mở file zip"
          />
          <Button
            disabled={shouldDisable}
            onClick={() => onExportZip()}
            style={{ backgroundColor: Colors.BUTTERSCOTCH, borderColor: Colors.BUTTERSCOTCH }}
            icon={<FileZipOutlined />}
            type="primary"
            aria-label="Xuất ra file zip"
          />
          {isElectron() && (
            <Button onClick={() => onOpenCache()} icon={<FolderOpenFilled />}>
              Mở folder cache
            </Button>
          )}
        </Space>
      </div>
    </>
  );
});
