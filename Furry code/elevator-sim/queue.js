class Queue {
    constructor() { this.people = []; }
    enqueue(e) { this.people.push(e); }
    dequeue()  { return this.isEmpty() ? null : this.people.shift(); }
    peek()     { return this.isEmpty() ? null : this.people[0]; }
    isEmpty()  { return this.people.length === 0; }
    size()     { return this.people.length; }
}

class FloorQueue extends Queue {
    dequeueNextWithDestinationAbove(floor) {
        const i = this.people.findIndex(p => p.destinationFloor > floor);
        return i >= 0 ? this.people.splice(i, 1)[0] : null;
    }
    dequeueNextWithDestinationBelow(floor) {
        const i = this.people.findIndex(p => p.destinationFloor < floor);
        return i >= 0 ? this.people.splice(i, 1)[0] : null;
    }
}

class ElevatorQueue extends Queue {
    dequeueAtFloor(floor) {
        const i = this.people.findIndex(p => p.destinationFloor === floor);
        return i >= 0 ? this.people.splice(i, 1)[0] : null;
    }
}
