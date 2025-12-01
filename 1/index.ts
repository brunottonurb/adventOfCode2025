import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const fileStream = createReadStream('test.txt');
const rl = createInterface({
    input: fileStream,
});

let solution: number = 0;
let x = 50;
let delta: number;
for await (const line of rl) {
    // console.log(line);
    delta = Number(line.slice(1));
    if (line[0] === 'L') {
        delta = -delta;
    }
    // console.log(delta);
    x += delta;
    x %= 100;
    if (x < 0) x+= 100;
    console.log(x);
    if (x === 0) {
        solution++;
    }
}

console.log('SOLUTION:', solution);

console.log('\n---\n');

const fileStream2 = createReadStream('input.txt');
const rl2 = createInterface({
    input: fileStream2,
});

let solution2: number = 0;
x = 50;
for await (const line of rl2) {
    process.stdout.write(line);
    delta = Number(line.slice(1));
    let negative = line[0] === 'L';
    let count = 0;
    const oldX = x;
    for (let index = 0; index < delta; index++) {
        if (negative) {
            x--;
            if (x < 0) {
                x+= 100;
            }
        } else {
            x++;
            if (x >= 100) {
                x -= 100;
            }
        }
        if (x === 0) {
            count++;
        }
    }
    process.stdout.write(`\t\t${count}`);
    process.stdout.write(`\t\t${oldX} ${negative ? '<-' : '->'} ${x}\n`);

    solution2 += count;
}

console.log('SOLUTION2:', solution2);
