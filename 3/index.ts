import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const fileStream = createReadStream('test.txt');
const rl = createInterface({
    input: fileStream,
});

let sum = 0;
const n = 12; // set to 2 for part 1, 12 for part 2

for await (const line of rl) {
    // find the largest digit
    const digits = line.split('').map(Number);

    const indexes: number[] = [];

    for (let m = 0; m < n; m++) {
        const start = m > 0 ? indexes[m - 1] + 1 : 0;
        const end = digits.length - n + m + 1;

        // console.log('Searching range', start, 'to', end);

        let index = digits.slice(start, end).reduce((indexOfBiggest, currentDigit, currentIndex, arr) => {
            if (currentDigit > arr[indexOfBiggest]) {
                return currentIndex;
            }

            return indexOfBiggest;
        }, 0);

        if (m > 0) {
            index += indexes[m - 1] + 1;
        }

        indexes.push(index);
    }

    sum += Number(indexes.map((i) => digits[i]).join(''));
}

console.log(sum);

