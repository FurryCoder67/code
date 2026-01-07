const runOnce = (convertMe) => {
    let counter = 0;

    const inner = (input) => {

        if (counter === 0) {

            const output = convertMe(input);
            counter++;

            return output;
        }

        return 'Sorry';
    };

    return inner;
};
const add2 = num => num + 2;
const runOnceAdd2 = runOnce(add2);

console.log(runOnceAdd2(2));
console.log(runOnceAdd2(3));