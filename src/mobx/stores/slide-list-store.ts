import { makeAutoObservable, observable, action } from "mobx";
import { SlideType } from "~/typings/types";
import { RootStore } from "~/mobx/root-store";

export class SlideListStore {
  rootStore: RootStore;
  list: SlideType[] = [];
  animationCount = 0;

  constructor(rs: RootStore) {
    this.rootStore = rs;
    makeAutoObservable(this, {
      list: observable,
      newSlide: action,
      setList: action,
    });
  }

  newSlide() {
    const newSlide = {
      title: "",
      slideBlocks: [],
      animations: [],
    };
    this.list.push(newSlide);
  }

  setList(newList: SlideType[]) {
    this.list = newList;
  }
}
