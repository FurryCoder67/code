/* new Promise(function (resolve, reject) {
    if (Math.random() < 0.5) {
        reject("We'll never know...");
    }
    resolve(67);
}).then(function (answer) {
    console.log(answer);
}).catch(function (error) {
    console.warn(error);
}).finally(function () {
    console.log('I run no matter what on 67 is happening');
}) */


/* Promise.all([
    fetch('https://jsonplaceholder.typicode.com/posts'),
    fetch('https://jsonplaceholder.typicode.com/users')
]).then(function (responses) {
    return Promise.all(responses.map(function (response) {
        return response.json();
    }));
}).then(function (data) {
    console.log(data);
}).catch(function (error) {
    console.log(error);
}); */

function traditionalFn() {
    fetch('https://jsonplaceholder.typicode.com/posts/').then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('Traditional Fetch', data);
    });
    console.log('Traditional Message');
}
/*  traditionalFn();  */

async function asyncFn() {
    await fetch('https://jsonplaceholder.typicode.com/posts/').then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log('Async Fetch', data);
    });
    console.log('Async Message');
}
/* asyncFn();  */

async function getTheAnswer() {
    return 42;
}
let answer = getTheAnswer().then(function (data) {
    //console.log(data);
});
/* console.log(answer); */

/* new Promise(function sayHello(resolve) {
    setTimeout(() => {
        console.log('Hello');
        resolve("tung");
    }, 1000);
}); */

function checkAge(age) {
    new Promise(function check(resolve, reject) {
        if (age >= 18) {
            resolve('Access Granted');
        } else {
            reject('Access Denied');
        }
    }).then(function resolve(data) {
        console.log(data);
    }).catch(function reject(data) {
        console.log(data);
    })
}
//checkAge(2);

function chain67s(two) {
    new Promise(function cal(resolve, reject) {
    }).then(
        two *= 3
    ).then(
        two += 4
    ).then(
        console.log(two)
    )
}
//chain67s(2);

/* function doDuck() {
    Promise.resolve(10).then(x => x * 2).then(x => console.log(x));
} */
/* doDuck()*/

async function task1() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Pochita Papaya');
        }, 1000);
    }).then((tinker) => {
        console.log(tinker);
    });
}
async function task2() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Pochita Papaya 2');
        }, 1000);
    }).then((tinker) => {
        console.log(tinker);
    });
}
async function task3() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Pochita Papaya 3');
        }, 1000);
    }).then((tinker) => {
        console.log(tinker);
    });
}
task1();
task2();
task3();