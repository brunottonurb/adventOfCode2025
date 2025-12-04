import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const fileStream = createReadStream('input.txt');
const rl = createInterface({
    input: fileStream,
});

const storage: string[][] = [];

let y = 0;
for await (const line of rl) {
    for (let x = 0; x < line.length; x++) {
        if (!storage[y]) {
            storage[y] = [line[x]];
        } else {
            storage[y].push(line[x]);
        }
    }
    y++;
}

const rowCount = storage.length;
const columnCount = storage[0].length;

function showStorage(s: string[][]) {
    console.log(s.map((row) => `${row.join('')}\n`).join(''));
}

function countNeighbors(s: string[][], x: number, y: number) {
    let count = 0;
    if (y > 0) {
        if (x > 0) {
            if (storage[y - 1][x - 1] !== '.') count++;
        }
        if (storage[y - 1][x] !== '.') count++;
        if (x < columnCount - 1) {
            if (storage[y - 1][x + 1] !== '.') count++;
        }
    }

    if (x > 0) {
        if (storage[y][x - 1] !== '.') count++;
    }
    if (x < columnCount - 1) {
        if (storage[y][x + 1] !== '.') count++;
    }

    if (y < rowCount - 1) {
        if (x > 0) {
            if (storage[y + 1][x - 1] !== '.') count++;
        }
        if (storage[y + 1][x] !== '.') count++;
        if (x < columnCount - 1) {
            if (storage[y + 1][x + 1] !== '.') count++;
        }
    }

    return count;
}

function removeXs(s: string[][]) {
    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < columnCount; x++) {
            if (s[y][x] === 'x') {
                s[y][x] = '.';
            }
        }
    }
}

function markXs(s: string[][]) {
    let marked = 0;
    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < columnCount; x++) {
            if (s[y][x] !== '@') {
                continue;
            }

            const neighbors = countNeighbors(s, x, y);

            if (neighbors < 4) {
                s[y][x] = 'x';
                marked++;
            }
        }
    }
    return marked;
}

function step() {
    let marked = markXs(storage);

    if (marked > 0) {
        removeXs(storage);
    }

    return marked;
}

showStorage(storage);

let result = 0;

// Part 1
result += step();
showStorage(storage);
console.log(result);

// Part 2
while (true) {
    const marked = step();
    if (marked < 1) {
        break;
    }
    result += marked;
}

console.log(result);