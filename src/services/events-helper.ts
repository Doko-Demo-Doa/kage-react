import mitt, { Handler } from "mitt";
import { AppEventType } from "~/typings/types";

export const emitter = mitt();

export const EventBus = {
  emit: (type: AppEventType, data?: any) => {
    return emitter.emit(type, data);
  },

  on: (type: AppEventType, handler: Handler<any>) => {
    return emitter.on(type, handler);
  },

  off: (type: AppEventType, handler: Handler<any>) => {
    return emitter.off(type, handler);
  },
};
