import { render } from "@testing-library/react";
import { CustomAudioPlayer } from "~/components/audio-player/audio-player";

/**
 * @jest-environment jsdom
 */
describe("Audio Player", () => {
  it("renders without trouble", () => {
    render(
      <CustomAudioPlayer
        autoPlay={false}
        src="https://example.com/test.mp3"
        style={{ width: "60%", userSelect: "none" }}
      />
    );
  });
});
