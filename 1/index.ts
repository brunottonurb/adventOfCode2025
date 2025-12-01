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
let negative: boolean;
for await (const line of rl2) {
    delta = Number(line.slice(1));
    negative = line[0] === 'L';

    solution2 += Math.trunc(delta / 100); // we pass the zero this many times
    delta = delta % 100; // we don't care about extra rotations from here

    // Remember: from here delta is smaller than 100!

    if (negative) {
        if (x !== 0 && (x - delta) < 0) { // check if we reach the negatives while going down, doesn't count if we start on zero
            solution2++; // we passed zero on our way down
        }
        x = (x - delta + 100) % 100; // add 100 because -13 % 100 is still -13 and not 87
    } else {
        if ((x + delta) > 100) { // check if we go over 100 on our way up, doesn't count if we start on zero
            solution2++; // we passed 100 on our way up (that means we passed zero)
        }
        x = (x + delta) % 100; // if over 100, wrap around
    }

    if (x === 0) {
        solution2++; // we landed on zero
    }

}

console.log('SOLUTION2:', solution2);
