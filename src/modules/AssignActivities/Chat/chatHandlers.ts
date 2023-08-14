export const messageHandlers = new Set();

export const addMessageHandler = (handler: Function) => {
  messageHandlers.add(handler);
};

export const removeMessageHandler = (handler: Function) => {
  messageHandlers.delete(handler);
};
