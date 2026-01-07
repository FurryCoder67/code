const copyArrayAndDouble = (array) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i] * 2);
    }
    return newArray;
};

const testArray = Object.freeze([1, 2, 3]);

const copyArrayAndDoubleResult = copyArrayAndDouble(testArray);
//console.log('copyArrayAndDoubleResult: ', copyArrayAndDoubleResult);

const doubleNumber = (number) => {
    return number * 2;
};

const copyArrayAndManipulate = (array, manipulation) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(manipulation(array[i]));
    }
    return newArray;
};

const copyArrayAndManupulateResult = copyArrayAndManipulate(testArray, doubleNumber);
//console.log('copyArrayAndManipulateResult: ', copyArrayAndManupulateResult);

// Private Variable

const createSecret = (secret) => {
    return { getSecret() { return secret } };
};
const s = createSecret("js is cool");
//console.log(s.getSecret());
//console.log(s.secret);

// Function Factory

const multiplyBy = (n) => {
    function getAnswer(num) {
        return n * num;
    }
    return getAnswer;
};
const double = multiplyBy(2);
const triple = multiplyBy(3);
//console.log(double(5));
//console.log(triple(5));

// Create Logger
const createLogger = (logName) => {
    return logMessage => `[${logName}]: ${logMessage}`;
};
const errorLog = createLogger("ERROR");
const infoLog = createLogger("INFO");
//console.log(errorLog("Something Broke"));
//console.log(infoLog("App Started"));

// Fix Loop

/* for (var i = 1; i <= 3; i++) {
    (function (currentI) {
        setTimeout(() => {
            console.log(currentI);
        }, 1000);
    })(i);
} */

/* function logLater(value) {
    setTimeout(() => {
        console.log(value);
    }, 1000);
}
for (var i = 1; i <= 3; i++) {
    logLater(i);
} */

// Bank Account

const createAccount = (initialBalance) => {
    let balance = initialBalance
    class bankAccount {
        deposit(amount) {
            balance += amount;
        }
        withDraw(amount) {
            balance -= amount;
        }
        getBalance() {
            return balance;
        }
    }
    const account = new bankAccount();
    return account;
};
const user = createAccount(67);
console.log(user);
user.deposit(4);
user.withDraw(9);
console.log(user.getBalance());