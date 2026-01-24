import { Queue, FloorQueue, ElevatorQueue } from "./queue.js";

// Direction constants
export const DIRECTION = { UP: 100, DOWN: 200 };

// ===== Person =====
export class Person {
    constructor(name, originFloor, destinationFloor) {
        this.name = name;
        this.originFloor = originFloor;
        this.destinationFloor = destinationFloor;
    }
    equals(otherperson) {
        return this.name === otherperson.name;
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
            if (p.destinationFloor > this.floorNumber) this.upButtonPressed = true;
            if (p.destinationFloor < this.floorNumber) this.downButtonPressed = true;
        }
    }
}

// ===== Elevator =====
export class Elevator {
    constructor(capacity, floors) {
        this.capacity = capacity;
        this.floors = floors;
        this.queue = new ElevatorQueue();
        this.currentFloor = 0;
        this.destinationFloor = null;
    }

    isFull() {
        return this.queue.size() >= this.capacity;
    }

    getNextDirection() {
        if (this.destinationFloor === null) return null;
        return this.destinationFloor > this.currentFloor ? DIRECTION.UP : DIRECTION.DOWN;
    }

    move() {
        if (this.destinationFloor === null) return false;
        if (this.currentFloor === this.destinationFloor) return false;

        if (this.getNextDirection() === DIRECTION.UP) this.currentFloor++;
        else this.currentFloor--;

        return true;
    }

    unloadPeople() {
        while (this.queue.dequeueAtFloor(this.currentFloor)) { }
    }

    loadPeople() {
        const floor = this.floors[this.currentFloor];
        const dir = this.getNextDirection();
        if (!dir) return;

        while (!this.isFull()) {
            let person;
            if (dir === DIRECTION.UP) person = floor.queue.dequeueNextWithDestinationAbove(this.currentFloor);
            else person = floor.queue.dequeueNextWithDestinationBelow(this.currentFloor);

            if (!person) break;
            this.queue.enqueue(person);
        }
    }

    getNextDestinationFloor() {
        if (!this.queue.isEmpty()) return this.queue.peek().destinationFloor;

        for (let i = 0; i < this.floors.length; i++) {
            const floor = this.floors[i];
            if (floor.upButtonPressed || floor.downButtonPressed) return floor.floorNumber;
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
    constructor(numElevators, numFloors) {
        this.floors = [];
        this.elevators = [];
        for (let i = 0; i < numFloors; i++) this.floors.push(new Floor(i));
        for (let i = 0; i < numElevators; i++) this.elevators.push(new Elevator(4, this.floors));
    }

    moveElevatorsAndLoad() {
        for (let i = 0; i < this.elevators.length; i++) this.elevators[i].moveAndLoad();
    }

    generatePeopleRandomly(n) {
        for (let i = 0; i < n; i++) {
            let from = Math.floor(Math.random() * this.floors.length);
            let to; while (to === from) {
                to = Math.floor(Math.random() * this.floors.length);
            }
            const p = new Person(String.fromCharCode(97 + Math.floor(Math.random() * 26)), from, to);
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
        this.building = new Building(numElevators, numFloors);
    }

    step() {
        this.timer++;
        this.building.generatePeopleRandomly(this.peoplePerSecond);
        for (let i = 0; i < this.building.floors.length; i++) this.building.floors[i].pressButtons();
        this.building.moveElevatorsAndLoad();
        this.animateCanvas();
    }

    toggleRun() {
        if (this.isRunning) {
            clearInterval(this.intervalId);
            this.isRunning = false;
        } else {
            const self = this;
            this.intervalId = setInterval(function () { self.step(); }, 1000);
            this.isRunning = true;
        }
    }

    animateCanvas() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const floorHeight = this.canvas.height / this.numFloors;

        ctx.font = "14px Arial";
        ctx.fillStyle = "black";

        for (let i = 0; i < this.numFloors; i++) {
            const y = i * floorHeight;

            ctx.strokeStyle = "grey";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();

            ctx.fillStyle = "black";
            ctx.fillText("Floor " + (this.numFloors - 1 - i), 10, y + 15);
        }

        ctx.beginPath();
        ctx.moveTo(0, this.numFloors * floorHeight);
        ctx.lineTo(this.canvas.width, this.numFloors * floorHeight);
        ctx.stroke();

        for (let i = 0; i < this.building.elevators.length; i++) {
            const e = this.building.elevators[i];
            ctx.fillStyle = "blue";
            const x = 50 + i * 60;
            const y = (this.numFloors - 1 - e.currentFloor) * floorHeight + 5;
            ctx.fillRect(x, y, 40, floorHeight - 10);
        }

        ctx.fillStyle = "black";
        ctx.fillText("Time: " + this.timer, 10, 20);
    }

}

// ===== RUN FUNCTION CALLED FROM BUTTON =====
const canvas = document.getElementById("canvas");
let sim = null;

export function run() {
    if (!sim) sim = new Simulation(3, 5, 2, canvas);
    sim.toggleRun();
}


// ========= Testing =========

class Test {
    constructor() {

    }
    testPerson() {
        const peoples = new Person('Bob', 6, 7);
        const peoplees = new Person('Timmy', 4, 1)
        console.assert(peoples.equals(peoplees) === false, 'Test 1 failed');
    }
    testAll() {
        this.testPerson();
    }
}
const test = new Test();
test.testAll();