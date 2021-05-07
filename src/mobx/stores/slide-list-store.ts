import { makeAutoObservable, observable, computed } from "mobx";
import { SlideType } from "~/typings/types";

export class SlideListStore {
  list: SlideType[] = [];
  animationCount = 0;

  constructor() {
    makeAutoObservable(this, {
      list: observable,
      animationCount: computed,
    });
  }
}
