import { Delta } from "quill";
// Không dùng short alias "~" vì sẽ conflict với electron build.
import { AnimationType, MediaType } from "../common/static-data";

export type FileNameWithPathType = {
  filename: string;
  path: string;
};

export type SlideBuilderState = {
  selectedIndex: number;
};

export type CustomPublishOptionType = {
  provider: "github";
  repo: string;
  owner: string;
  private: boolean;
  token: string;
};

export type SlideStockBackgroundMetaType = {
  name: string;
  description: string;
  list: Array<{
    label: string;
    file: string;
  }>;
};

export type SlideType = {
  id: string;
  title?: string;
  titleFontSize?: number; // Mặc định là 60px
  isHidden?: boolean;
  linkedQuizId?: string;
  selectedBlock?: string;
  slideBlocks: SlideBlockType[];
  animations: SlideAnimationType[];
  background?: string;
};

export interface SlideBlockType {
  id: string;
  type: MediaType;
  isHidden?: boolean;
  content?: string; // Chỉ có nếu type là text
  deltaContent?: Delta;
  assetName?: string;
  autoPlay?: boolean;
  bgColor?: string; // Must be in hex, e.g: #FFF
  position?: PositionType;
  anchor?: PositionType; // Dùng cho block Callout
  size?: BlockSizeType;
}

export type SlideStepType = {
  blockId: number;
};

export type SlideAnimationType = {
  id: string;
  blockId: string;
  animationType: AnimationType;
  animationIndex: number;
  mediaAutoplay?: boolean;
};

export type PositionType = {
  x: number;
  y: number;
};

export type BlockSizeType = {
  w: number;
  h: number;
  scale?: number;
};

// Misc

export type FFProbeMetaType = {
  chapters: string[];
  streams: [MediaStreamType];
};

export type MediaStreamType = {
  avg_frame_rate: string;
  codec_long_name: string;
  codec_name: string;
  codec_tag: string;
  codec_tag_string: "avc1" | "xvid" | string;
  codec_time_base: string;
  codec_type: "video" | "audio";
  display_aspect_ratio: string;
  duration: number; // Second
  duration_ts: number; // Timestamp
  has_b_frames: number;
  height: number;
  index: number;
  level: number;
  pix_fmt: string;
  profile: string;
  r_frame_rate: string;
  sample_aspect_ratio: string;
  start_pts: number;
  time_base: string;
  width: number;
};

export type MediaReturnType = {
  filePath: string; // Also includes fileName
  fileName: string;
  extension: string;
  extra?: any; // Size, position, etc
};

export type AppEventType = "SWITCH_TAB" | "NEXT_CLICK";

export type Choice = {
  id: string;
  label: string;
};

export type BlankMatcher = {
  id: string;
  label: string;
  correctChoice: string;
  choices: Choice[];
};

export type QuizAssetType = {
  id: string;
  fileName: string;
  extension: string;
};

export type QResult = "correct" | "incorrect" | "mixed" | "undetermined";

export type SelectedQuizId =
  | string
  | {
      matcherId: string;
      choiceId: string;
    };

export type QuizResultType = {
  judge: QResult;
  acquired: number;
  selectedIds: SelectedQuizId[];
};

export type SettingKey = "auth" | "profile" | "upload" | "general";

export type AnswerResultType = "correct" | "incorrect" | "mixed" | "timeout";
