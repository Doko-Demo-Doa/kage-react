import { atom } from "recoil";

const slideBuilderState = atom({
  key: "slideBuilderState",
  default: {
    data: ["test"]
  },
});
