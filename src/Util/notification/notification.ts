import { notification } from 'antd';

export const openNotification = (type: 'success' | 'info' | 'warning' | 'error', message: string, description: string) => {
  notification[type]({
    message: message,
    description: description,
  });
};
