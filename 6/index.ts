import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const fileStream = createReadStream('input.txt');
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

// Part 2
