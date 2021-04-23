import { notification, message, Modal } from "antd";
import { Delta } from "quill";
import ReactQuill from "react-quill";

// Alternative: react-quill/dist/quill.bubble.css
import "react-quill/dist/quill.snow.css";
import "~/routes/authen/builder/slide-builder/slide-builder-toolbar/slide-builder-toolbar.scss";

export type NotificationType = "success" | "error" | "info" | "warning" | "warn" | "open";
export type MessageType = "success" | "error" | "info" | "warning" | "warn" | "loading";

export const uiUtils = {
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
};

// Ref: https://quilljs.com/docs/modules/toolbar/
export const defaultQuillToolbar = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];
