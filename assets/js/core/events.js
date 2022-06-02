export class Event {
	constructor() {
		this.listeners = new Set();
	}

	addEventListener(listener) {
		this.listeners.add(listener);
	}

	removeEventListener(listener) {
		this.listeners.delete(listener);
	}

	dispatch(eventData) {
		for (let listener of this.listeners) {
			listener(eventData);
		}
	}
}