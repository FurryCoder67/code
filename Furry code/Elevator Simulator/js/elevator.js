import { Queue, FloorQueue, ElevatorQueue } from "./queue.js";

export const DIRECTION = {
    UP: 100,
    DOWN: 200
};

// ===== Person =====
export class Person {
    constructor(name, originFloor, destinationFloor) {
        this.name = name;
        this.originFloor = originFloor;
        this.destinationFloor = destinationFloor;
    }

    equals(otherPerson) {
        return otherPerson && this.name === otherPerson.name;
    }
}

// ===== Floor =====
export class Floor {
    constructor(floorNumber) {
        this.floorNumber = floorNumber;
        this.queue = new FloorQueue();
        this.upButtonPressed = false;
        this.downButtonPressed = false;
    }

    addPerson(person) {
        this.queue.enqueue(person);
    }

    pressButtons() {
        this.upButtonPressed = false;
        this.downButtonPressed = false;

        for (let i = 0; i < this.queue.arr.length; i++) {
            const p = this.queue.arr[i];

            if (p.destinationFloor > this.floorNumber) {
                this.upButtonPressed = true;
            }

            if (p.destinationFloor < this.floorNumber) {
                this.downButtonPressed = true;
            }
        }
    }
}

// ===== Elevator =====
export class Elevator {
    constructor(capacity, floors, people = []) {
        this.capacity = capacity;
        this.floors = floors;
        this.queue = new ElevatorQueue(people || []);
        this.currentFloor = 0;
        this.destinationFloor = null;
    }

    isFull() {
        return this.queue.size() >= this.capacity;
    }

    getNextDirection() {
        if (this.destinationFloor === null) {
            return null;
        }

        if (this.destinationFloor > this.currentFloor) {
            return DIRECTION.UP;
        }

        if (this.destinationFloor < this.currentFloor) {
            return DIRECTION.DOWN;
        }

        return null;
    }

    move() {
        if (this.destinationFloor === null) {
            return false;
        }

        if (this.currentFloor === this.destinationFloor) {
            return false;
        }

        if (this.getNextDirection() === DIRECTION.UP) {
            this.currentFloor++;
        } else {
            this.currentFloor--;
        }

        return true;
    }

    unloadPeople() {
        while (this.queue.dequeueAtFloor(this.currentFloor)) {
        }
    }

    loadPeople() {
        const floor = this.floors[this.currentFloor];

        let dir = this.getNextDirection();

        if (!dir) {
            if (floor.upButtonPressed) {
                dir = DIRECTION.UP;
            } else if (floor.downButtonPressed) {
                dir = DIRECTION.DOWN;
            } else {
                return;
            }
        }

        while (!this.isFull()) {
            let person;

            if (dir === DIRECTION.UP) {
                person = floor.queue.dequeueUp(this.currentFloor);
            } else {
                person = floor.queue.dequeueDown(this.currentFloor);
            }

            if (!person) {
                break;
            }

            this.queue.enqueue(person);
        }
    }

    getNextDestinationFloor() {
        // If elevator has passengers
        if (!this.queue.isEmpty()) {
            return this.queue.peek().destinationFloor;
        }

        // Otherwise check floors
        for (let i = 0; i < this.floors.length; i++) {
            const floor = this.floors[i];

            if (floor.upButtonPressed || floor.downButtonPressed) {
                return floor.floorNumber;
            }
        }

        return null;
    }

    moveAndLoad() {
        if (!this.move()) {
            this.unloadPeople();
            this.loadPeople();
            this.destinationFloor = this.getNextDestinationFloor();
        }
    }
}

// ===== Building =====
export class Building {
    constructor(numElevators, numFloors, people = []) {
        this.floors = [];
        this.elevators = [];

        for (let i = 0; i < numFloors; i++) {
            this.floors.push(new Floor(i));
        }

        for (let i = 0; i < numElevators; i++) {
            this.elevators.push(new Elevator(4, this.floors, people));
        }
    }

    moveElevatorsAndLoad() {
        for (let i = 0; i < this.elevators.length; i++) {
            this.elevators[i].moveAndLoad();
        }
    }

    generatePeopleRandomly(n) {
        for (let i = 0; i < n; i++) {
            let from = Math.floor(Math.random() * this.floors.length);
            let to = from;

            while (to === from) {
                to = Math.floor(Math.random() * this.floors.length);
            }

            const p = new Person(
                String.fromCharCode(97 + Math.floor(Math.random() * 26)),
                from,
                to
            );

            this.floors[from].addPerson(p);
        }
    }
}

// ===== Simulation =====
export class Simulation {
    constructor(numElevators, numFloors, peoplePerSecond, canvas) {
        this.numElevators = numElevators;
        this.numFloors = numFloors;
        this.peoplePerSecond = peoplePerSecond;
        this.canvas = canvas;
        this.timer = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.people = [];

        this.building = new Building(
            numElevators,
            numFloors,
            this.people
        );
    }

    step() {
        this.timer++;
        this.building.generatePeopleRandomly(this.peoplePerSecond);
        for (let i = 0; i < this.building.floors.length; i++) {
            this.building.floors[i].pressButtons();
        }
        this.building.moveElevatorsAndLoad();
        console.clear();
        console.log("Timer:", this.timer);
        for (let i = 0; i < this.building.elevators.length; i++) {
            const currentElevator = this.building.elevators[i];
            console.log("Elevator Number: " + i, "Floor:", currentElevator.currentFloor, "People:", currentElevator.queue.size(), "Destination:", currentElevator.destinationFloor ?? "None", "Direction:", currentElevator.getNextDirection() === 100 ? "Up" : currentElevator.getNextDirection() === 200 ? "Down" : "Idle");
        }
        for (let i = 0; i < this.building.floors.length; i++) {
            const currentFloor = this.building.floors[i];
            console.log("Floor Number: " + i, "Waiting People: ", currentFloor.queue.size(), "Up: ", currentFloor.upButtonPressed, "Down: ", currentFloor.downButtonPressed);
        }
    }
    toggleRun() {
        if (this.isRunning) {
            clearInterval(this.intervalId);
            this.isRunning = false;
        } else {
            this.intervalId = setInterval(() => {
                this.step();
            }, 1000);

            this.isRunning = true;
        }
    }
}