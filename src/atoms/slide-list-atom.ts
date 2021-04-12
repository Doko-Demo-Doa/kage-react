import { atom } from "recoil";
import { SlideType } from "~/typings/types";

export const slideListState = atom<SlideType[]>({
  key: "slideListState",
  default: [],
});
