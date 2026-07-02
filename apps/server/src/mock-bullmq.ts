const processors = new Map<string, Function>();

export type Job<T = any, R = any, N extends string = string> = any;

export class Worker<T = any, R = any, N extends string = string> {
  constructor(public name: string, public processor: Function, opts?: any) {
    processors.set(name, processor);
    console.log(`[Mock BullMQ] Worker registered for queue: ${name}`);
  }
  on(event: string, callback: (...args: any[]) => void) {}
  waitUntilReady() { return Promise.resolve(this); }
  close() { return Promise.resolve(); }
}

export class Queue<T = any> {
  constructor(public name: string, opts?: any) {}
  async add(name: string, data: T, opts?: any) {
    const processor = processors.get(this.name);
    if (processor) {
      // Execute asynchronously without blocking
      setTimeout(() => {
        processor({ name, data }).catch(console.error);
      }, 0);
    } else {
      console.warn(`[Mock BullMQ] No processor found for queue: ${this.name}, dropping job: ${name}`);
    }
    return { id: Math.random().toString() } as Job;
  }
}
