export const RESOURCE_PROTOCOL = "local-resource://";
export const SLIDE_HTML_ENTRY_FILE = "index.html";
export const SLIDE_HTML_HIDDEN_ENTRY_FILE = "index-hidden.html";
export const SLIDE_MANIFEST_FILE = "manifest.json";

export const BREAKING_CHANGE_VERSIONS = [
  {
    ver: "0.1.22",
    note: "Sửa lỗi hỏng file zip",
  },
  {
    ver: "0.1.14",
    note: "Sửa lỗi bị lệch chữ",
  },
];

export const ALLOWED_IMPORT_EXTENSIONS = ["zip", "dsa", "dst"];

export enum ElectronEventType {
  UPDATE_CHECK = "UPDATE_CHECK",
  UPDATE_ERROR = "UPDATE_ERROR",
  UPDATE_AVAILABLE = "UPDATE_AVAILABLE",
  UPDATE_NOT_AVAILABLE = "UPDATE_NOT_AVAILABLE",
  UPDATE_DOWNLOADED = "UPDATE_DOWNLOADED",
  DOWNLOAD_PROGRESS = "DOWNLOAD_PROGRESS",
  QUIT_TO_INSTALL = "QUIT_TO_INSTALL",
  OPEN_PREVIEW = "OPEN_PREVIEW",
  OPEN_APP_CLOSE_PROMPT = "OPEN_APP_CLOSE_PROMPT",
  ON_CANCEL_CLOSE_PROMPT = "ON_CANCEL_CLOSE_PROMPT",
  CLOSE_APP = "CLOSE_APP",
  OPEN_DEVTOOLS = "OPEN_DEVTOOLS",
}

export const AVAILABLE_FONT_SIZES = [
  "16px",
  "20px",
  "24px",
  "38px",
  "36px",
  "48px",
  "54px",
  "72px",
];

export const DEFAULT_TITLE_FONT_SIZE = 60;

export const DEFAULT_COLOR_PICKER_PALETTE = [
  "#D9E3F0",
  "#F47373",
  "#697689",
  "#37D67A",
  "#2CCCE4",
  "#555555",
  "#dce775",
  "#ff8a65",
  "#ba68c8",
  "transparent",
];

// Size của tờ canvas konva, tính bằng px
export const MinimumCanvasSize = {
  WIDTH: 740,
  HEIGHT: 555,
};

// Gốc toạ độ là góc trên bên trái
export const InitialBlockCoordinate = {
  x: 320,
  y: 170,
};

export const AppDefaults = {
  DEFAULT_IMAGE_SCALE: 0.4,
};

export enum QuizType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICES = "MULTIPLE_CHOICES",
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
  SELECT_IN_THE_BLANKS = "SELECT_IN_THE_BLANKS",
}

export enum AnimationType {
  APPEAR,
  DISAPPEAR,
  MOVE,
  AUDIO_PLAY,
  VIDEO_PLAY,
}

export enum MediaType {
  VIDEO,
  AUDIO,
  IMAGE,
  TEXT_BLOCK,
  TABLE,
  CALLOUT,
}
