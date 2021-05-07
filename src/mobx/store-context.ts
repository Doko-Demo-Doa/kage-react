import React from "react";
import { RootStore } from "~/mobx/root-store";

// MobX store.
export const StoreContext = React.createContext<RootStore | null>(null);
