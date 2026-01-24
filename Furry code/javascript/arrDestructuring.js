const arr = [10, 20, 30];

const [a, b, c] = arr;

/* console.log(a);
console.log(b);
console.log(c); */

const nums = [1, 2, 3, 4];

const [first, , third] = nums;

/* console.log(`${first}, ${third}`); */

const numz = [5, 6, 7, 8];

const [firzt, ...rest] = numz;

/* console.log(firzt);
console.log(rest); */

const user = {
    name: "Alex",
    age: 20,
};

const { name, age } = user;

/* console.log(age);
console.log(name); */

const { name: userName, age: years } = user;

/* console.log(userName);
console.log(years); */

const user2 = {
    name: "Taylor",
    address: {
        city: "NYC",
        zip: 10001,
    },
};

const {
    address: { city, zip },
} = user2;

/* console.log(zip);
console.log(city);
 */

function sum([a, b]) {
    return a + b;
}

/* console.log(sum([6, 7])); */

const settings = {
    theme: "dark",
    language: "en",
};

const { theme, fontSize = 14, } = settings;

console.log(theme);
console.log(fontSize);