type PropEventSource<T> = {
  on(eventName: `${string & keyof T}Changed`, callback: (newValue: T[keyof T]) => void): void;
};

export function makeWatchedObject<T extends object>(obj: T): T & PropEventSource<T> {
  const handlers: { [event: string]: ((newValue: any) => void)[] } = {};

  return new Proxy(obj as any, {
    get(target, prop, receiver) {
      if (prop === "on") {
        return (eventName: string, callback: (newValue: any) => void) => {
          if (!handlers[eventName]) handlers[eventName] = [];
          handlers[eventName].push(callback);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const oldValue = target[prop];
      target[prop] = value;
      if (oldValue !== value) {
        const eventName = `${String(prop)}Changed`;
        handlers[eventName]?.forEach(cb => cb(value));
      }
      return true;
    }
  }) as T & PropEventSource<T>;
} 
