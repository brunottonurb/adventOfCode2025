import { readFile } from 'fs/promises';

const ranges = (await readFile('input.txt', 'utf8')).split(',');

// Part 1

// const invalidIDs: number[] = [];

// for (const range of ranges) {
//     const [start, end] = range.split('-').map(Number);
    
//     for (let current = start; current <= end; current++) {
//         const currentString = current.toString();
//         const length = currentString.length;

//         // console.log(current);

//         if (length % 2 > 0) {
//             // console.log('uneven');
//             continue;
//         }

//         // console.log(currentString.slice(0, length / 2), currentString.slice(length / 2))

//         if (currentString.slice(0, length / 2) === currentString.slice(length / 2)) {
//             invalidIDs.push(current);
//         }
//     }
// }

// console.log(invalidIDs.reduce((sum, curr) => sum + curr, 0));

// Part 2

function hasRepetion(numStr: string, numStrLen: number, divisor: number): boolean {
    if (numStrLen % divisor !== 0) return false;
    const fragments: string[] = [];
    // console.log(`Divide string "${numStr} into ${divisor} parts of length ${numStrLen / divisor}`);
    const numStrArr = numStr.split('');
    for (let index = 0; index < divisor; index++) {
        fragments.push(numStrArr.splice(0, numStrLen / divisor).join(''));
    }
    // console.log(fragments, fragments.every((fragment) => fragment === fragments[0]));

    // check if all parts are the same
    if (fragments.every((fragment) => fragment === fragments[0])) {
        return true;
    }
    return false;
}

const invalidIDs2: number[] = [];

for (const range of ranges) {
    const [start, end] = range.split('-').map(Number);
    
    for (let current = start; current <= end; current++) {
        if (current.toString()[0] === '0') {
            console.log('LEADING ZERO!!!!11');
            continue;
        }

        if (current.toString().length === 1) {
            console.log('LENGTH 1');
            continue;
        }

        const currentString = current.toString();
        const length = currentString.length;

        // console.log(current);

        let divisor = 2;
        let isInvalidId = false;

        for (divisor; divisor <= length / 2; divisor++) {
            // console.log(length, '%', divisor, '=', length % divisor);
            if (hasRepetion(currentString, length, divisor)) {
                isInvalidId = true;
                break;
            }
        }

        if (isInvalidId) {
            invalidIDs2.push(current);
            continue;
        }

        divisor = length;
        // console.log(length, '%', divisor, '=', length % divisor);
        if (hasRepetion(currentString, length, divisor)) {
            invalidIDs2.push(current);
        }
    }
}

console.log(invalidIDs2.length);
console.log(new Set(invalidIDs2).size);
console.log(invalidIDs2.reduce((sum, curr) => sum + curr, 0));
