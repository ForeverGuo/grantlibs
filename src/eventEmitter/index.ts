type Events = {
  [key: string]: unknown;
};

class EventEmitter<Events> {
  private subscribers: {
    [key: string]: Array<(data: Events[keyof Events]) => void>;
  } = {};

  // 订阅事件
  on(eventName: string, callback: (data: Events[keyof Events]) => void) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(callback);
  }

  // 取消订阅事件
  off(eventName: string, callback: (data: Events[keyof Events]) => void) {
    const subscribers = this.subscribers[eventName];
    if (!subscribers) return;

    this.subscribers[eventName] = subscribers.filter(subscriber => subscriber !== callback);
  }

  // 只触发一次
  once(eventName: string, callback: (data: Events[keyof Events]) => void) {
    const onceCallback = (data: Events[keyof Events]) => {
      callback(data);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }

  // 触发事件
  emit(eventName: string, data?: Events[keyof Events]) {
    const subscribers = this.subscribers[eventName];
    if (!subscribers) return;

    subscribers.forEach(subscriber => {
      subscriber(data);
    });
  }
}

export const eventEmitter = new EventEmitter()
