class IBindable {
  constructor() {
    this.observers = new Set();
  }
  
  destroy() {
    this.observers = null;
  }

  get() { return new Error("Not Implemented!"); }
  set(val) { return new Error("Not Implemented!"); }

  broadcast(val) {
    for (let observer of this.observers) {
      observer(val);
    }
  }
  
  subscribe(observer) {
    if (this.observers.has(observer) == false) {
      this.observers.add(observer);
    }
    return new Subscription(this.observers, observer);
  }
}

export class BindableValue extends IBindable {
  constructor(initVal) {
    super();
    this.val = initVal;
  }

  get() { this.val; }
  set(val) { 
    if (this.val == val) return;

    this.val = val;
    this.broadcast(val);
  }
}

export class BindableObject extends IBindable {
  constructor(get, set, event) {
    super();
    this.getMethod = get;
    this.setMethod = set;
    this.event = event;
		this.eventListener = () => { this.broadcast(this.getMethod()); }
    this.event.addEventListener(this.eventListener.bind(this));
  }

  destroy() {
    super.destroy();
    this.event.removeEventListener(this.eventListener);
  }

  get() {
    return this.getMethod();
  }

  set(val) {
    if (this.getMethod() == val) return;

    this.setMethod(val);
    this.broadcast(this.getMethod());
  }
}

class Subscription {
  constructor(observers, observer) {
    this.observers = observers;
    this.observer = observer;
  }

  dispose() {
    this.observers.delete(this.observer);
    this.observers = null;
    this.observer = null;
  }
}