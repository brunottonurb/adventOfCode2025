import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const fileStream = createReadStream('input.txt');
const rl = createInterface({
    input: fileStream,
});

let solution: number = 0;
let x = 50;
let delta: number;
for await (const line of rl) {
    console.log(line);
    delta = Number(line.slice(1));
    if (line[0] === 'L') {
        delta = -delta;
    }
    // console.log(delta);
    x += delta;
    x %= 100;
    console.log(x);
    if (x === 0) {
        solution++;
    }
}

console.log('SOLUTION:', solution);
