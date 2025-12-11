import { readFile } from 'fs/promises';

// const fileName = 'test.txt';
// const sideLength = 12;
const fileName = 'input.txt';
const sideLength = 100000;

const file = await readFile(fileName, 'utf-8');
const lines = file.split('\n');
lines.pop();

const coordinates: [number, number][] = lines.map((line) => line.split(',')).map((c) => c.map(Number)) as [number, number][];

// const [maxX, maxY] = coordinates.reduce((prev, curr) => {
//     let [x, y] = prev;
//     if (curr[0] > x) x = curr[0];
//     if (curr[1] > y) y = curr[1];
//     return [x, y];
// }, [0, 0]);

// console.log(maxX, maxY);

function calculateArea(a: [number, number], b: [number, number]): number {
    let [maxX, minX] = [a[0], b[0]].sort((a, b) => b - a);
    let [maxY, minY] = [a[1], b[1]].sort((a, b) => b - a);

    // maxX -= 1;
    // minY -= 1;

    // console.log('');
    // console.log(`(${maxX} - ${minX}) * (${maxY} - ${minY})`);
    // console.log(`(${maxX - minX}) * (${maxY - minY})`);

    return (maxX - minX + 1) * (maxY - minY + 1);
}

let bestCoordinates = [coordinates[0], coordinates[1]];
// @ts-ignore
let largestArea = calculateArea(...bestCoordinates);

console.log(largestArea);


// console.log(coordinates[1], coordinates[5]);
// largestArea = calculateArea(coordinates[1], coordinates[5]);

// console.log(largestArea);

for (let i = 0; i < coordinates.length; i++) {
    for (let j = 1; j < coordinates.length; j++) {
        if (i === j) {
            continue;
        }
        const a = calculateArea(coordinates[i], coordinates[j])
        if (a > largestArea) {
            bestCoordinates = [coordinates[i], coordinates[j]];
            largestArea = a;
        }
    }
}

console.log();
console.log(bestCoordinates);
console.log(largestArea);

// Part 2

// // if point is in the rectangle, return true, else return false

// function checkIfLineIntersects(pointA: [number, number], pointB: [number, number]) {
//     for (let index = 0; index < coordinates.length - 1; index++) {
        
//     }
// }

console.log(coordinates);

// const board: number[][] = new Array(sideLength);
// for (let y = 0; y < sideLength; y++) {
//     board[y] = new Array(sideLength + 1).fill(0);
// }

// console.log(board);
let prevPoint = coordinates[0];

coordinates.push(coordinates[0]);

// const obstacles = 

for (let index = 1; index < coordinates.length; index++) {
    const currPoint = coordinates[index];
    // board[currPoint[1]][currPoint[0]] = 3;
    if (currPoint[0] > prevPoint[0]) {
        for (let x = prevPoint[0] + 1; x < currPoint[0]; x++) {
            // board[currPoint[1]][x] = 1;
            console.log(x, currPoint[1]);
        }
    } else if (currPoint[0] < prevPoint[0]) {
        for (let x = prevPoint[0] - 1; x > currPoint[0]; x--) {
            // board[currPoint[1]][x] = 1;
            console.log(x, currPoint[1]);
        }
    } else if (currPoint[1] > prevPoint[1]) {
        for (let y = prevPoint[1] + 1; y < currPoint[1]; y++) {
            // board[y][currPoint[0]] = 2;
            console.log(currPoint[0], y);
        }
    } else { // currPoint[1] < prevPoint[1]
        for (let y = prevPoint[1] - 1; y > currPoint[1]; y--) {
            // board[y][currPoint[0]] = 2;
            console.log(currPoint[0], y);
        }
    }
    prevPoint = coordinates[index];
}

// console.log(board);

// board.forEach(row => {
//     for (let i = 0; i < row.length; i++) {
//         if (row[i] === 0) {
//             process.stdout.write('.');
//         } else if (row[i] === 1) {
//             process.stdout.write('―');
//         } else if (row[i] === 2) {
//             process.stdout.write('|');
//         } else if (row[i] === 3) {
//             process.stdout.write('O');
//         }
//     }
//     process.stdout.write('\n');
// });
