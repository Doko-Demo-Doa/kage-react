export enum QuizType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
  FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
  SELECT_FROM_LISTS = "SELECT_FROM_LISTS",
}

export enum SlideStepType {
  APPEAR,
  DISAPPEAR,
  MOVE,
  AUDIO_PLAY,
  VIDEO_PLAY
}

// Size của tờ canvas konva, tính bằng px
export const MinimumCanvasSize = {
  WIDTH: 900,
  HEIGHT: 560
};
