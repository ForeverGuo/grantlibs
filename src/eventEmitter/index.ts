type Events = {
  [key: string]: unknown;
};

const subscribers: {
  [key: string]: Array<(data: Events[keyof Events]) => void>;
} = {};

// 订阅事件
export function subsOn(eventName: string, callback: (data: Events[keyof Events]) => void) {
  if (!subscribers[eventName]) {
    subscribers[eventName] = [];
  }
  subscribers[eventName].push(callback);
}

// 取消订阅事件
export function subsOff(eventName: string, callback: (data: Events[keyof Events]) => void) {
  if (!subscribers[eventName]) return;
  subscribers[eventName] = subscribers[eventName].filter(subscriber => {
    return subscriber.name !== callback.name
  });
}

// 只触发一次
export function subsOnce(eventName: string, callback: (data: Events[keyof Events]) => void) {
  const onceCallback = (data: Events[keyof Events]) => {
    callback(data);
    subsOff(eventName, onceCallback);
  };
  subsOn(eventName, onceCallback);
}

// 触发事件
export function subsEmit(eventName: string, data?: Events[keyof Events]) {
  if (!subscribers[eventName]) return;

  subscribers[eventName].forEach(subscriber => {
    subscriber(data);
  });
}


