const fs = require('fs');

const readStream = fs.createReadStream('./lorem.txt', { encoding: 'utf-8' });
const writeStream = fs.createWriteStream('./lordno.txt');

/* readStream.on('data', (chunk) => {
    console.log(' ------- NEW CHUNK -------');
    console.log(chunk);
    writeStream.write('\nNEW CHUNK\n');
    writeStream.write(chunk);
}); */

//Piping
readStream.pipe(writeStream);