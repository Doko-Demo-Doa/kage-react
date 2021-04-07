import { notification, message } from 'antd';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'warn' | 'open';
export type MessageType = 'success' | 'error' | 'info' | 'warning' | 'warn' | 'loading';

/**
 * Type must be one of:
 * success
 * error
 * info
 * warning
 * warn
 * open
 */
export const openNotification = (type: NotificationType, title: string, msg: string) => {
  notification[type]({
    message: title,
    description: msg,
  });
};

/**
 * Type must be:
 * success
 * error
 * info
 * waning
 * warn
 * loading
 */
export const showMessage = (msg: string, type: MessageType = 'info', maxCount = 1) => {
  message.config({
    maxCount,
  });
  return message[type](msg);
};
