export const RESOURCE_PROTOCOL = "local-resource://";

// Size của tờ canvas konva, tính bằng px
export const MinimumCanvasSize = {
  WIDTH: 740,
  HEIGHT: 540,
};

// Gốc toạ độ là góc trên bên trái
export const InitialBlockCoordinate = {
  x: 420,
  y: 270,
};

export const AppDefaults = {
  DEFAULT_IMAGE_SCALE: 0.4,
};

export enum QuizType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
  FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
  SELECT_FROM_LISTS = "SELECT_FROM_LISTS",
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
