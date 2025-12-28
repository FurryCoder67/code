class Employee {
    constructor(salary, id, name) {
        this.salary = salary;
        this.id = id;
        this.name = name;
    }
    getSalary() {
        return this.salary;
    }
    slackOff() {
        return `${this.name} is currently running in the park with his dog and two mountain lions🦧`;
    }
}
class Ceo extends Employee {
    constructor(stockOptions, salary, id, name) {
        super(salary, id, name);
        this.stockOptions = stockOptions;
    }
    manage() {
        return `${this.name} is currently eating his bad employees😋😋😋😋`;
    }
    slackOff() {
        return `${this.name} is currently hopping around his bedroom eating gluesticks🥸`;
    }
}
class CodeMonkey extends Employee {
    constructor(gamingLaptop, salary, name, id) {
        super(salary, id, name);
        this.gamingLaptop = gamingLaptop;
    }
    Code() {
        return `${this.name} is a real monkey coder🐒🙈🙉🙊`;
    }
    slackOff() {
        return `${this.name} is currently in the jungle eating his fellow monkeys and prancing around with the orangutans🦧🙉🙉🙉🙉🙉🦧🦧🦧🦧🦧🦧🦧`;
    }
}
let allGuy = new Ceo('sell his soul on ebay', 6767, 6767676767, 'Poop')
class Dog {
    constructor(name, breed) {
        this.name = name;
        this.breed = breed;
    }
    bark() {
        return `${this.name} can bark🐕`;
    }
}
class LabRet extends Dog {
    constructor(name) {
        super(name);
    }
    Fun() {
        return `${this.name} is having fun`;
    }
    bark() {
        return `${this.name} can bark🐕 glop glop`;
    }
}
class GoldRet extends Dog {
    constructor(name) {
        super(name);
    }
}
let Aisha = new LabRet('Aisha');
console.log(Aisha.bark());