import { MediaType } from "~/common/static-data";

export type SlideBuilderState = {
  selectedIndex: number;
};

export type SlideType = {
  title?: string;
  theme?: string;
  selectedBlock?: string;
  slideBlocks: SlideBlockType[];
  steps: SlideStepType[];
};

export interface SlideBlockType {
  id: string;
  type: MediaType;
  content?: string; // Chỉ có nếu type là text
  assetName?: string;
  autoPlay?: boolean;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    w: number;
    h: number;
  };
}

export type SlideStepType = {
  blockId: number;
};

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
  level: 13;
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
};
