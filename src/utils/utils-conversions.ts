import { FFProbeMetaType, VideoStreamType } from "~/typings/types";

export const ffmpegUtils = {
  isTooBig: (width: number, height: number) => {
    if (width > 848 || height > 480) return true;
    return false;
  },

  checkVideoMetadata: (filePath: string): Promise<VideoStreamType> => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");

    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .ffprobe(0, function (err: any, data: FFProbeMetaType) {
          console.dir(data);
          if (data) {
            const videoStream = data.streams.find((n) => n.codec_type === "video");
            if (videoStream) {
              return resolve(videoStream);
            }
          }
          reject(err);
        });
    });
  },

  convertToMp4: (filePath: string, inputWidth: number, progressCallback?: (percent: number | string) => void) => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");
    const isVideo = (/\.(gif|mkv|mp4|wmv|avi|webp)$/i).test(filePath);

    const ratio = (848 / inputWidth) * 100;

    if (isVideo) {
      const cmd = ffmpeg()
        .on("start", function (ffmpegCommand: string) {
          console.log("[ffmpeg command]:", ffmpegCommand);
        })
        .on("progress", function (data: any) {
          // console.log("[ffmpeg]:", data);
          progressCallback?.(data.percent);
        })
        .on("end", function () {
          console.log("[ffmpeg end]");
          progressCallback?.("end");
        })
        .on("error", function (error: any) {
          console.log("[ffmpeg error]:", error);
        })
        .input(filePath)
        .size(`${ratio.toFixed(0)}%`)
        .output("D:\\test.mp4");
      cmd.run();
    } else {
      console.log("[ffmpeg]", "Input file is not a valid video");
    }
  }
};
