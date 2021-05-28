import { makeAutoObservable } from "mobx";
import { RootStore } from "~/mobx/root-store";

export class SettingsStore {
  rootStore: RootStore;
  autoStartup = false; // Auto starts at login.

  constructor(rs: RootStore) {
    this.rootStore = rs;

    makeAutoObservable(this, {}, { autoBind: true });
  }
}
