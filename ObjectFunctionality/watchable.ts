type PropEventSource<T> = {
  on(eventName: `${string & keyof T}Changed`, callback: (newValue: T[keyof T]) => void): void;
};

export class Watchable implements PropEventSource<any> {
  private handlers: { [event: string]: ((newValue: any) => void)[] } = {};

  on(eventName: string, callback: (newValue: any) => void): void {
    if (!this.handlers[eventName]) this.handlers[eventName] = [];
    this.handlers[eventName].push(callback);
  }

  protected fireChange<K extends string>(prop: K, value: any) {
    const eventName = `${prop}Changed`;
    this.handlers[eventName]?.forEach(cb => cb(value));
  }
}
