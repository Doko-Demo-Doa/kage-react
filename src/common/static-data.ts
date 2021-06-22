export const RESOURCE_PROTOCOL = "local-resource://";

export enum ElectronEventType {
  UPDATE_CHECK = "UPDATE_CHECK",
  UPDATE_ERROR = "UPDATE_ERROR",
  UPDATE_AVAILABLE = "UPDATE_AVAILABLE",
  UPDATE_NOT_AVAILABLE = "UPDATE_NOT_AVAILABLE",
  UPDATE_DOWNLOADED = "UPDATE_DOWNLOADED",
}

export const AVAILABLE_FONT_SIZES = [
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "20px",
  "24px",
  "38px",
  "36px",
  "48px",
];

// Size của tờ canvas konva, tính bằng px
export const MinimumCanvasSize = {
  WIDTH: 740,
  HEIGHT: 540,
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
