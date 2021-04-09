import { MediaType } from "~/common/static-data";

export type SlideBuilderState = {
  selectedIndex: number;
}

export type SlideType = {
  title?: string;
  theme?: string;
  steps: SlideStepType[];
}

export interface SlideBlockType {
  id: number;
  type: MediaType;
  assetName?: string;
}

export type SlideStepType = {
  blockId: number;
}

export type FFProbeMetaType = {
  chapters: string[];
  streams: [VideoStreamType];
}

export type VideoStreamType = {
  index: number;
  codec_name: string;
  codec_long_name: string;
  profile: string;
  codec_type: "video" | "audio";
  codec_time_base: string;
  codec_tag_string: "avc1" | "xvid" | string;
  codec_tag: string;
  width: number;
  height: number;
  has_b_frames: number;
  sample_aspect_ratio: string;
  display_aspect_ratio: string;
  pix_fmt: string;
  level: 13;
  r_frame_rate: string;
  avg_frame_rate: string;
  time_base: string;
  start_pts: number;
}
