class Sim {
    constructor(elevators, floors, pplPerSec, canvas, timer) {
        this.elevators = elevators;
        this.floors = floors;
        this.pplPerSec = pplPerSec;
        this.canvas = canvas;
        this.timer = timer;
        this.active = false;
    }
    toggleRun() {
        if (this.active === false) {
            this.active = true;
        } else {
            this.active = false;
        }
    }
}

class Building {
    constructor(elevators, floors) {
        this.elevators = elevators;
        this.floors = floors;
    }
    moveElevatorsAndLoad() {

    }
    getFloor(floorNumber) {

    }
    getNumberFloors() {

    }
    generatePeopleRandomly(numberPeople) {

    }
}