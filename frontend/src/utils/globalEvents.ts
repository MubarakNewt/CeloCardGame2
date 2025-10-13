// A minimal event emitter that works between components
type EventCallback = () => void;

const listeners: Record<string, EventCallback[]> = {};

export const onEvent = (name: string, callback: EventCallback) => {
  if (!listeners[name]) listeners[name] = [];
  listeners[name].push(callback);
  return () => {
    listeners[name] = listeners[name].filter((cb) => cb !== callback);
  };
};

export const emitEvent = (name: string) => {
  (listeners[name] || []).forEach((cb) => cb());
};
