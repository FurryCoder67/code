let count = 5;

const outer = () => {
    let count = 0;

    const addNumberToCount = (number) => {
        count += number;

        //consoe.log('count', count);
    };

    return addNumberToCount;

};

const munky = outer();
const ohioby = outer();
/* console.log(munky(2));
console.log(ohioby(2)); */

// Once Call Function

const once = (fn) => {
    let bool = true;
    return () => {
        if (!bool) {
            return `You Can Only Call This Function Once`;
        }
        bool = false;
        return fn();
    }
};
const init = once(() => {
    console.log("Initialized");
    return 42;
});
//init();
//init();

// OOP PROGRAMMING RUN ONCE!!!

class Once {
    constructor() {
        this.ran = false;
    }
    runOnce() {
        if (this.ran) {
            return `You Can Only Call This Function Once`;
        }
        this.ran = true;
        //  console.log('Skibidi Ohio');
    }
}
const newOnce = new Once();
newOnce.ran = false;
/* console.log(newOnce.runOnce());
console.log(newOnce.runOnce());
 */
// Memoize

function memoize(fn) {
    const map = new Map();
    return (n) => {
        if (map.get(n) !== undefined) {
            return map.get(n);
        } else {
            let fnn = fn(n);
            map.set(n, fnn);
            return fnn;
        }
    }
}
const slowSquare = n => {
    console.log('Attempting to tinker with a brain as small as yours');
    return n * n;
};

const fastSquare = memoize(slowSquare);
//console.log(fastSquare(4));
//console.log(fastSquare(4));

// Chain String Transformers

const fns = [
    str => str.trim(),
    str => str.toUpperCase(),
    str => `${str}!`
];

const runFns = (acc, curr) => {
    return curr(acc);
};

const reductionarytillatel = fns.reduce(runFns, " hello ");
//console.log(reductionarytillatel);

// Reset Closures

function makeCounter() {
    class Counter {
        constructor() {
            this.i = 0;
        }

        inc() {
            this.i++;
            return this.i;
        }

        reset() {
            this.i = 0;
            return this.i;
        }
    }

    return new Counter();
}

const c = makeCounter();
/* console.log(c.inc());   // 1
console.log(c.inc());   // 2
console.log(c.reset()); // 0
console.log(c.inc());   // 1 */

// Number Validator

const validators = [
    n => n > 0,
    n => n % 2 === 0,
    n => n < 100
];

const validate = (n) => {
    return validators.reduce((acc, validator) => {
        return acc && validator(n);
    }, true);
};

/* console.log(validate(10));
console.log(validate(3));
console.log(validate(200));
 */

//