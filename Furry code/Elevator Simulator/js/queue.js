export class Queue {
    constructor() {
        this.arr = [];
    }
    enqueue(element) {
        this.arr.push(element);
        return this.arr;
    }
    dequeue() {
        return !this.isEmpty() ? this.arr.shift() : null;
    }
    peek() {
        return !this.isEmpty() ? this.arr[0] : null;
    }
    isEmpty() {
        return this.arr.length === 0;
    }
    size() {
        return this.arr.length;
    }
}
export class FloorQueue extends Queue {
    dequeueUp(floor) {
        if (this.isEmpty()) return null;
        const i = this.arr.findIndex(p => p.destinationFloor > floor);
        return i >= 0 ? this.arr.splice(i, 1)[0] : null;
    }
    dequeueDown(floor) {
        if (this.isEmpty()) return null;
        const i = this.arr.findIndex(p => p.destinationFloor < floor);
        return i >= 0 ? this.arr.splice(i, 1)[0] : null;
    }
}

export class ElevatorQueue extends Queue {
    constructor(people = []) {
        super();
        this.arr = [...people];
    }
    dequeueAtFloor(floor) {
        if (this.isEmpty()) return null;
        const i = this.arr.findIndex(p => p.destinationFloor === floor);
        if (i >= 0) {
            return this.arr.splice(i, 1)[0];
        }
        return null;
    }
}
