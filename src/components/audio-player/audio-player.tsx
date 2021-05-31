import React from "react";
import AudioPlayer from "react-h5-audio-player";

import "~/components/audio-player/audio-player.scss";

interface Props {
  autoPlay?: boolean;
  src?: string;
  header?: React.ReactNode;
  style?: React.CSSProperties;
}

export const CustomAudioPlayer: React.FC<Props> = ({ src, header, autoPlay, style }) => {
  return (
    <AudioPlayer
      autoPlay={autoPlay}
      autoPlayAfterSrcChange={false}
      src={src}
      header={header}
      showJumpControls={false}
      customVolumeControls={[]}
      customAdditionalControls={[]}
      style={style}
    />
  );
};
