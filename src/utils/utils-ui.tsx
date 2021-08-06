/* eslint-disable @typescript-eslint/no-unused-vars */
import { notification, message, Modal } from "antd";
import { Delta } from "quill";
import ReactQuill, { Quill } from "react-quill";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { BlockSizeType, PositionType } from "~/typings/types";
import { AVAILABLE_FONT_SIZES } from "~/common/static-data";

// Alternative: react-quill/dist/quill.bubble.css
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

export type NotificationType = "success" | "error" | "info" | "warning" | "warn" | "open";
export type MessageType = "success" | "error" | "info" | "warning" | "warn" | "loading";

const SizeStyle = Quill.import("attributors/style/size");
const sizes = AVAILABLE_FONT_SIZES;

SizeStyle.whitelist = sizes;
Quill.register(SizeStyle, true);

export const uiUtils = {
  setBrowserTitle: (newTitle: string) => {
    document.title = newTitle;
  },
  showConfirmation: (
    title: string,
    desc: string,
    onOk: () => void | undefined,
    onCancel: () => void | undefined
  ) => {
    Modal.confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content: desc,
      onOk() {
        onOk();
      },
      onCancel() {
        onCancel();
      },
    });
  },
  /**
   * Type must be one of:
   * success
   * error
   * info
   * warning
   * warn
   * open
   */
  openNotification: (type: NotificationType, title: string, msg: string) => {
    notification[type]({
      message: title,
      description: msg,
    });
  },

  /**
   * Type must be:
   * success
   * error
   * info
   * waning
   * warn
   * loading
   */
  showMessage: (msg: string, type: MessageType = "info", maxCount = 1) => {
    message.config({
      maxCount,
    });
    return message[type](msg);
  },

  showQuillEditor: (
    seedData: Delta | string,
    callback: (data: Delta | undefined) => void | undefined
  ) => {
    let quillRef: ReactQuill;

    Modal.success({
      title: "Chèn chữ",
      centered: true,
      width: 600,
      content: (
        <>
          <ReactQuill
            defaultValue={seedData}
            modules={{
              toolbar: defaultQuillToolbar,
            }}
            ref={(ref) => {
              if (ref) {
                quillRef = ref;
              }
            }}
            theme="snow"
          />
        </>
      ),
      onOk: () => {
        const data = quillRef?.getEditor().getContents();
        callback(data);
      },
    });
  },

  getAnchorLegData: (
    blockPos: PositionType,
    blockSize: BlockSizeType,
    anchorHead: PositionType
  ) => {
    const blockTopLeft = blockPos;
    const blockTopRight: PositionType = {
      x: blockPos.x + blockSize.w,
      y: blockPos.y,
    };
    const blockBottomLeft: PositionType = {
      x: blockPos.x,
      y: blockPos.y,
    };
    const blockBottomRight: PositionType = {
      x: blockPos.x + blockSize.w,
      y: blockPos.y + blockSize.h,
    };

    const THRESHOLD_PIXEL = 10;
    const FLOOR_THRESHOLD = 0.35;
    const CEIL_THRESHOLD = 0.75;

    let leg1: PositionType, leg2: PositionType;

    // Nằm trên:
    if (anchorHead.y < blockTopLeft.y) {
      if (anchorHead.x < blockTopLeft.y - 10) {
        leg1 = { x: blockTopLeft.x, y: blockTopLeft.y };
      }
    }
  },
};

// Ref: https://quilljs.com/docs/modules/toolbar/
export const defaultQuillToolbar = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
  [{ align: [] }],
];
