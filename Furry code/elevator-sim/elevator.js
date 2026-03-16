// Depends on: queue.js, elevatorcanvas.js

class Person {
    constructor(name, originFloor, destinationFloor) {
        this.name             = name;
        this.originFloor      = originFloor;
        this.destinationFloor = destinationFloor;
    }
}

const DIRECTION = Object.freeze({ UP: 'UP', DOWN: 'DOWN' });

/**
 * Base elevator class. Moves one floor per step, unloads before loading,
 * and picks the next destination from its queue or from floor buttons.
 */
class Elevator {
    constructor(capacity, floors) {
        this.capacity         = capacity;
        this.floors           = floors;
        this.queue            = new ElevatorQueue();
        this.currentFloor     = 0;
        this.destinationFloor = 0;
    }

    isFull() { return this.queue.size() >= this.capacity; }

    move() {
        if (this.currentFloor === this.destinationFloor) return false;
        this.currentFloor += this.currentFloor < this.destinationFloor ? 1 : -1;
        return true;
    }

    getNextDestinationFloor() {
        if (!this.queue.isEmpty()) return this.queue.peek().destinationFloor;
        for (let f of this.floors) {
            if (f.floorNumber !== this.currentFloor && (f.upButtonPressed || f.downButtonPressed))
                return f.floorNumber;
        }
        return this.currentFloor;
    }

    getNextDirection() {
        return this.getNextDestinationFloor() >= this.currentFloor ? DIRECTION.UP : DIRECTION.DOWN;
    }

    unLoadPeople() {
        return this.queue.dequeueAtFloor(this.currentFloor) !== null;
    }

    loadPeople() {
        if (this.isFull()) return false;
        const floor  = this.floors[this.currentFloor];
        const person = this.getNextDirection() === DIRECTION.UP
            ? floor.queue.dequeueNextWithDestinationAbove(this.currentFloor)
            : floor.queue.dequeueNextWithDestinationBelow(this.currentFloor);
        if (!person) return false;
        this.queue.enqueue(person);
        return true;
    }

    moveAndLoad() {
        if (!this.move()) {
            if (!this.unLoadPeople())
                if (!this.loadPeople())
                    this.destinationFloor = this.getNextDestinationFloor();
        }
    }
}

class RegularElevator extends Elevator {
    constructor(floors) { super(4, floors); }
}

/**
 * A floor holds a queue of waiting people and tracks call-button state.
 */
class Floor {
    constructor(floorNumber) {
        this.floorNumber       = floorNumber;
        this.queue             = new FloorQueue();
        this.upButtonPressed   = false;
        this.downButtonPressed = false;
    }

    addPerson(person) { this.queue.enqueue(person); }

    pressButtons() {
        this.upButtonPressed   = false;
        this.downButtonPressed = false;
        for (let p of this.queue.people) {
            if (p.destinationFloor > this.floorNumber) this.upButtonPressed   = true;
            if (p.destinationFloor < this.floorNumber) this.downButtonPressed = true;
        }
    }
}

/**
 * The building owns all floors and elevators, and drives each simulation step.
 */
class Building {
    constructor(numElevators, numFloors) {
        this.floors    = Array.from({ length: numFloors    }, (_, i) => new Floor(i));
        this.elevators = Array.from({ length: numElevators }, ()     => new RegularElevator(this.floors));
    }

    step() { for (let e of this.elevators) e.moveAndLoad(); }

    getFloor(n) { return this.floors[n]; }

    generatePeopleRandomly(n) {
        const names = 'abcdefghijklmnopqrstuvwxyz'.split('');
        for (let i = 0; i < n; i++) {
            const name   = names[Math.floor(Math.random() * names.length)];
            const origin = Math.floor(Math.random() * this.floors.length);
            let dest;
            do { dest = Math.floor(Math.random() * this.floors.length); } while (dest === origin);
            this.getFloor(origin).addPerson(new Person(name, origin, dest));
        }
    }
}

/**
 * Simulation ties the building to the renderer and drives the interval loop.
 */
class Simulation {
    constructor(numElevators, numFloors, peoplePerStep, canvas) {
        this.peoplePerStep = peoplePerStep;
        this.isRunning     = false;
        this.intervalId    = null;
        this.building      = new Building(numElevators, numFloors);
        this.renderer      = new ElevatorCanvas(canvas);
    }

    step() {
        this.building.generatePeopleRandomly(this.peoplePerStep);
        this.building.floors.forEach(f => f.pressButtons());
        this.building.step();
        this.renderer.render(this.building);
    }

    toggle() { this.isRunning ? this.pause() : this.play(); }

    play() {
        this.intervalId = setInterval(() => this.step(), 1000);
        this.isRunning  = true;
    }

    pause() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isRunning  = false;
    }
}
