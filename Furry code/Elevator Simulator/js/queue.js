import { Person } from "./elevator.js";

export class Queue {
    constructor() {
        this.arr = [];
    }
    enqueue(element) {
        this.arr.push(element);
        return this.arr;
    }
    dequeue() {
        if (!this.arr.isEmpty()) {
            return this.arr.shift();
        } else {
            return null;
        }
    }
    peek() {
        if (!this.arr.isEmpty()) return this.arr[0];
        return null;
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
        const i = this.people.findIndex(p => p.destinationFloor > floor);
        if (i >= 0) {
            return this.people.splice(i, 1)[0]
        } else {
            return null;
        }
    }

    dequeueDown(floor) {
        const i = this.people.findIndex(p => p.destinationFloor < floor);
        if (i >= 0) {
            return this.people.splice(i, 1)[0]
        } else {
            return null;
        }
    }
}

export class ElevatorQueue extends Queue {
    dequeueAtFloor(floor) {
        const i = this.people.findIndex(p => p.destinationFloor === floor);
        if (i >= 0) {
            return this.people.splice(i, 1)[0];
        } else {
            return null;
        }
    }
}