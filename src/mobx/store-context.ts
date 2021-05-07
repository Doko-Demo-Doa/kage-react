import React from "react";
import { rootStore, RootStore } from "~/mobx/root-store";

// MobX store.
export const StoreContext = React.createContext<RootStore>(rootStore);
