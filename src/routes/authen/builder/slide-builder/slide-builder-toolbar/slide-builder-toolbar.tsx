import React, { useContext, useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { Button, Divider, Tooltip, notification, Space, Spin } from "antd";
import {
  EyeOutlined,
  FolderOpenFilled,
  FontSizeOutlined,
  FundViewOutlined,
  MessageOutlined,
  PlusOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { uniq } from "rambdax";
import dayjs from "dayjs";
import { Delta } from "quill";
import { observer } from "mobx-react";

import { NewQuizSetBtn } from "~/routes/authen/builder/slide-builder/slide-builder-toolbar/new-quiz-set-btn/new-quiz-set-btn";
import { fileUtils } from "~/utils/utils-files";
import { audioUtils, ffmpegUtils, imageUtils } from "~/utils/utils-conversions";
import {
  AppDefaults,
  ElectronEventType,
  InitialBlockCoordinate,
  MediaType,
  SLIDE_HTML_ENTRY_FILE,
} from "~/common/static-data";
import { dataUtils } from "~/utils/utils-data";
import { isElectron } from "~/utils/utils-platform";
import { uiUtils } from "~/utils/utils-ui";
import { commonHelper } from "~/common/helper";
import { Colors } from "~/common/colors";
import { SlideBlockType } from "~/typings/types";
import { StoreContext } from "~/mobx/store-context";

import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar.scss";

const INTERVAL_TIME = 60000;

export const SlideBuilderToolbar: React.FC = observer(() => {
  const [isLoading, setLoading] = useState(false);

  const store = useContext(StoreContext);
  const { list, setList, newSlide, importSlideTree } = store.slideListStore;
  const {
    selectedIndex,
    lastSavedTimestamp,
    currentWorkingFile,
    setIndex,
    importMeta,
    setCurrentWorkingFile,
  } = store.slideBuilderStore;

  const shouldDisable = list.length <= 0;

  useEffect(() => {
    // Tự động save sau interval.
    const interv = setInterval(() => {
      if (currentWorkingFile) {
        console.info("[Autosave] Auto-saved file to: ", currentWorkingFile);
        saveZipFile(currentWorkingFile);
      }
    }, INTERVAL_TIME);

    return () => {
      clearInterval(interv);
    };
  });

  const saveZipFile = (outputPath: string) => {
    const assetList = updateDataToCache();
    const backgroundAssetList = list.map((n) => n.background || "").filter(Boolean);
    fileUtils.zipFilesTo(outputPath, assetList, backgroundAssetList);
  };

  const onNewSlide = () => {
    newSlide();
    if (list.length) {
      setIndex(list.length - 1);
    }
  };

  const onInsertMedia = async () => {
    const path = await fileUtils.selectSingleFile();
    if (path) {
      const mType = fileUtils.detectMediaType(path);
      if (mType === MediaType.VIDEO) {
        // Video
        setLoading(true);
        const resp = await ffmpegUtils.checkVideoMetadata(path);
        ffmpegUtils.optimizeVideo(
          path,
          resp.width,
          (progress, filePath, fileName, extension, ratio) => {
            if (progress === "end") {
              // Hiển thị message báo convert
              setLoading(false);
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
        setLoading(true);
        audioUtils.optimizeAudio(path, undefined, (progress, filePath, fileName, extension) => {
          if (progress === "end") {
            // Hiển thị message báo convert
            setLoading(false);
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

  const onExportToFolder = async () => {
    const assetList = updateDataToCache();

    const folderPath = await fileUtils.launchFolderSaveDialog();
    if (folderPath) {
      const backgroundAssetList = list.map((n) => n.background || "").filter(Boolean);
      fileUtils.copyFromCacheToDest(folderPath, assetList, backgroundAssetList);
    }
  };

  const onImportZip = async () => {
    const path = await fileUtils.openFileDialog();
    if (path) {
      const zipContent = fileUtils.readZipEntries(path);
      if (zipContent?.includes(SLIDE_HTML_ENTRY_FILE) && zipContent.includes("manifest.json")) {
        // TODO: Có thể xem xét cách khác để verify file zip này không.
        // Hiện chỉ mới check 2 file trên nếu ok thì triển.
        const manifest = fileUtils.extractZipToCache(path);
        // Sau khi extract thì nạp vào bộ nhớ.
        if (manifest) {
          // Nạp manifest mới vào.
          const data = JSON.parse(manifest);
          importMeta(data.id);
          importSlideTree(data.layout);
          setIndex(0);

          setCurrentWorkingFile(path);
        }
      }
    }
  };

  const onExportZip = async () => {
    const path = await fileUtils.launchFileSaveDialog();
    if (path) {
      saveZipFile(path);
    }
  };

  const onOpenCache = () => {
    fileUtils.openFolderBrowser(fileUtils.getCacheDirectory());
  };

  /**
   * Bật / tắt preview
   */
  const onTogglePreview = () => {
    updateDataToCache();
    ipcRenderer.send(ElectronEventType.OPEN_PREVIEW);
  };

  /**
   * Ghi dữ liệu từ mobx store thành file HTML hoàn chỉnh, lên danh sách các asset được sử dụng trong các trang slide.
   * @returns Danh sách asset đã được lọc không trùng lặp.
   */
  const updateDataToCache = () => {
    let assetList: string[] = [];
    list.forEach((item) => {
      const assetItems = item.slideBlocks.map((n) => n.assetName || "").filter((n) => n !== ".");
      assetList = [...assetList, ...assetItems];
    });

    fileUtils.saveSlideJsonToCache(commonHelper.prepareExportData(list));

    const convertedStr = dataUtils.convertToHtmlSlideData(list, false);
    fileUtils.writeToHtml(convertedStr);
    const convertedStrHidden = dataUtils.convertToHtmlSlideData(list, true);
    fileUtils.writeToHtml(convertedStrHidden, true);

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
      isHidden: false,
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
    const idx = selectedIndex;
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
      <div className="slide-builder-toolbar">
        <Space>
          <Tooltip placement="bottom" title="Tạo slide mới">
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={() => onNewSlide()} />
          </Tooltip>
          <NewQuizSetBtn />

          <Divider type="vertical" />

          <Tooltip placement="bottom" title="Mở file zip / dsa">
            <Button
              onClick={() => onImportZip()}
              icon={<FolderOpenOutlined />}
              type="primary"
              ghost
              aria-label="Mở file zip"
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Lưu lại file">
            <Button
              disabled={shouldDisable}
              onClick={() => onExportZip()}
              icon={<SaveOutlined />}
              type="primary"
              ghost
            />
          </Tooltip>

          <Divider type="vertical" />

          <Tooltip placement="bottom" title="Bật / tắt xem thử">
            <Button
              onClick={() => onTogglePreview()}
              icon={<EyeOutlined />}
              type="primary"
              aria-label="Bật / tắt xem thử"
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Xuất ra thư mục">
            <Button
              disabled={shouldDisable}
              onClick={() => onExportToFolder()}
              icon={<UploadOutlined />}
              type="primary"
            />
          </Tooltip>

          <Divider type="vertical" />

          <Tooltip placement="bottom" title="Chèn chữ">
            <Button
              type="link"
              icon={<FontSizeOutlined />}
              size="middle"
              disabled={shouldDisable}
              onClick={() => onNewRichText("")}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Chèn ảnh / video / audio">
            <Button
              type="link"
              icon={<FundViewOutlined />}
              size="middle"
              disabled={shouldDisable}
              onClick={() => onInsertMedia()}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Chèn ô hội thoại">
            <Button
              disabled={shouldDisable}
              type="link"
              icon={<MessageOutlined />}
              size="middle"
              onClick={() => onInsertCallout()}
            />
          </Tooltip>

          <Divider type="vertical" />

          {isElectron() && (
            <Button onClick={() => onOpenCache()} icon={<FolderOpenFilled />}>
              Mở folder cache
            </Button>
          )}

          {lastSavedTimestamp ? (
            <div>{`Lần lưu lại cuối: ${dayjs.unix(lastSavedTimestamp).format("hh:mm")}`}</div>
          ) : null}

          {isLoading && <Spin style={{ marginTop: 4 }} />}
        </Space>
      </div>
    </>
  );
});
