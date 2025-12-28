let count = 5;

const outer = () => {
    let count = 0;

    const addNumberToCount = (number) => {
        count += number;

        console.log('count', count);
    };

    return addNumberToCount;

};

const munky = outer();
const ohioby = outer();
console.log(munky(2));
console.log(ohioby(2));