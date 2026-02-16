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

    equals(otherperson) {
        return otherperson && this.name === otherperson.name;
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

            if (p.destinationFloor > this.floorNumber)
                this.upButtonPressed = true;

            if (p.destinationFloor < this.floorNumber)
                this.downButtonPressed = true;
        }
    }
}

// ===== Elevator =====
export class Elevator {
    constructor(capacity, floors, people = []) {
        this.capacity = capacity;
        this.floors = floors;
        this.queue = new ElevatorQueue(people);
        this.currentFloor = 0;
        this.destinationFloor = null;
    }

    isFull() {
        return this.queue.size() >= this.capacity;
    }

    getNextDirection() {
        if (this.destinationFloor === null) return null;
        return this.destinationFloor > this.currentFloor
            ? DIRECTION.UP
            : DIRECTION.DOWN;
    }

    move() {
        if (this.destinationFloor === null) return false;
        if (this.currentFloor === this.destinationFloor) return false;

        if (this.getNextDirection() === DIRECTION.UP)
            this.currentFloor++;
        else
            this.currentFloor--;
        return true;
    }

    unloadPeople() {
        while (this.queue.dequeueAtFloor(this.currentFloor)) { }
    }

    loadPeople() {
        const floor = this.floors[this.currentFloor];

        let dir = this.getNextDirection();

        if (!dir) {
            if (floor.upButtonPressed) dir = DIRECTION.UP;
            else if (floor.downButtonPressed) dir = DIRECTION.DOWN;
            else return;
        }

        while (!this.isFull()) {
            let person =
                dir === DIRECTION.UP
                    ? floor.queue.dequeueUp(this.currentFloor)
                    : floor.queue.dequeueDown(this.currentFloor);

            if (!person) break;

            this.queue.enqueue(person);
        }
    }

    getNextDestinationFloor() {
        if (!this.queue.isEmpty())
            return this.queue.peek().destinationFloor;

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

// ===== RegularElevator =====
class RegularElevator extends Elevator {
    constructor(capacity, floors) {
        super(capacity, floors, []);

        const babyJack = new Person("Baby Jack", 0, 1);
        const Bob = new Person("Bob", 3, 0);
        const Charlie = new Person("Charlie", 0, 1);

        this.queue = new ElevatorQueue([babyJack, Bob, Charlie]);
        this.currentFloor = 0;
        this.destinationFloor = null;
    }
}

// ===== Building =====
export class Building {
    constructor(numElevators, numFloors, people = []) {
        this.floors = [];
        this.elevators = [];

        for (let i = 0; i < numFloors; i++)
            this.floors.push(new Floor(i));

        for (let i = 0; i < numElevators; i++)
            this.elevators.push(new Elevator(4, this.floors, people));
    }

    moveElevatorsAndLoad() {
        for (let i = 0; i < this.elevators.length; i++)
            this.elevators[i].moveAndLoad();
    }

    generatePeopleRandomly(n) {
        for (let i = 0; i < n; i++) {
            let from = Math.floor(Math.random() * this.floors.length);
            let to = from;

            while (to === from)
                to = Math.floor(Math.random() * this.floors.length);

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
        this.ctx = canvas.getContext("2d");

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
        this.animateCanvas();
        console.log(`NEXT STEP!!!!!!!!!!!!!!`);
        console.log(`Number of elevators: ${this.building.numElevators}`);
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
        console.log(`isRunning: ${this.isRunning}`);
    }

    animateCanvas() {

    }
}

// ========= Testing =========
class Test {

    testQueue() {
        const q = new Queue();

        console.assert(q.isEmpty() === true);
        q.enqueue(5);
        console.assert(q.size() === 1);
        console.assert(q.peek() === 5);
        console.assert(q.dequeue() === 5);
        console.assert(q.isEmpty() === true);
    }

    testFloorButtons() {
        const floor = new Floor(2);

        floor.addPerson(new Person("A", 2, 5));
        floor.addPerson(new Person("B", 2, 1));

        floor.pressButtons();

        console.assert(floor.upButtonPressed === true);
        console.assert(floor.downButtonPressed === true);
    }

    testElevatorMovement() {
        const floors = [new Floor(0), new Floor(1), new Floor(2)];
        const elevator = new Elevator(4, floors);

        elevator.destinationFloor = 2;

        elevator.move();
        console.assert(elevator.currentFloor === 1);

        elevator.move();
        console.assert(elevator.currentFloor === 2);

        console.assert(elevator.move() === false);
    }

    testElevatorLoadUnload() {
        const floors = [new Floor(0), new Floor(1), new Floor(2)];
        const elevator = new Elevator(4, floors);

        const p = new Person("A", 0, 2);

        floors[0].addPerson(p);
        floors[0].pressButtons();

        elevator.destinationFloor = 0;
        elevator.loadPeople();

        console.assert(elevator.queue.size() === 1);

        elevator.currentFloor = 2;
        elevator.unloadPeople();

        console.assert(elevator.queue.isEmpty() === true);
    }

    testBuilding() {
        const building = new Building(3, 5);

        console.assert(building.elevators.length === 3);
        console.assert(building.floors.length === 5);
    }

    testSimulationStep() {
        const canvas = document.createElement("canvas");
        const sim = new Simulation(1, 3, 0, canvas);

        const before = sim.timer;
        sim.step();
        const after = sim.timer;

        console.assert(after === before + 1);
    }

    testAll() {
        this.testQueue();
        this.testFloorButtons();
        this.testElevatorMovement();
        this.testElevatorLoadUnload();
        this.testBuilding();
        this.testSimulationStep();
        console.log("All tests passed");
    }
}

const test = new Test();
// test.testAll();
