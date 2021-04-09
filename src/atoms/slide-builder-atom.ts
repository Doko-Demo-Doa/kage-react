import { atom } from "recoil";
import { SlideBuilderState } from "~/typings/types";

export const slideBuilderState = atom<SlideBuilderState>({
  key: "slideBuilderState",
  default: {
    selectedIndex: 0
  },
});
