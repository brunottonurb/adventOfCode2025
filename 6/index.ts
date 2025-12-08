import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { createInterface } from 'readline';

const fileName = 'input.txt';

const fileStream = createReadStream(fileName);
const rl = createInterface({
    input: fileStream,
});

const operands: number[][] = [];
const operators: string[] = [];

for await (const line of rl) {
    line.match(/\S+/g)?.forEach((item, index) => {
        const num = Number(item);
        if (isNaN(num)) {
            operators[index] = item;
        } else if (!operands[index]) {
            operands.push([Number(item)])
        } else {
            operands[index].push(Number(item));
        }
    });
}

console.log(operands);
console.log(operators);

// Part 1

let sum = 0;
operands.forEach((arr, index) => {
    switch (operators[index]) {
        case '*':
            sum += arr.reduce((prev, curr) => prev * curr, 1);
            break;
        case '+':
            sum += arr.reduce((prev, curr) => prev + curr, 0);
            break;
        default:
            console.error('Unknown operation', operators[index]);
            break;
    }
});

console.log(sum);

// Part 2'

const file = await readFile(fileName, 'utf-8');
const lines = file.split('\n');
lines.pop();
lines.pop();

const inputs: number[][] = [];

let n = 0;
let index = 0;
while (n < lines[0].length) {
    let digit: string = '';
    for (const line of lines) {
        digit += line[n];
    }
    if (digit.match(/^\s*$/)) {
        index++;
    } else {
        if (!inputs[index]) {
            inputs[index] = [Number(digit)];
        } else {
            inputs[index].push(Number(digit));
        }
    }
    n++;
}

console.log(inputs);

sum = 0;
inputs.forEach((arr, index) => {
    switch (operators[index]) {
        case '*':
            sum += arr.reduce((prev, curr) => prev * curr, 1);
            break;
        case '+':
            sum += arr.reduce((prev, curr) => prev + curr, 0);
            break;
        default:
            console.error('Unknown operation', operators[index]);
            break;
    }
});

console.log(sum);