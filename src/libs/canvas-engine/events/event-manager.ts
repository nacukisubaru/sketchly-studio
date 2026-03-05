type EventHandler<T = any> = (payload: T) => void;

export default class EventManager {
  private listeners = new Map<string, Set<EventHandler>>();

  on<T = any>(event: string, handler: EventHandler<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(handler);

    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  emit<T = any>(event: string, payload: T) {
    const handlers = this.listeners.get(event);

    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }
}
