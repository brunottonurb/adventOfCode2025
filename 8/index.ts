import { readFile } from 'fs/promises';

const fileName = 'input.txt';
const n = 1000;

const file = await readFile(fileName, 'utf-8');
const lines = file.split('\n');
lines.pop();

type Point = [number, number, number];
const distances: Record<string, number> = {};
const points: Point[] = lines.map((line) => line.split(',').map(Number)) as Point[];
let circuits: any[][] = points.map((point) => [point.join(',')]);

// console.log(points);

function distance(a: Point, b: Point): number {
    return Math.sqrt((b[0] - a[0])**2 + (b[1] - a[1])**2 + (b[2] - a[2])**2);
}

for (const pointA of points) {
    for (const pointB of points) {
        const [strA, strB] = [pointA, pointB].map((point) => point.join(','));
        if (strA !== strB) {
            const key1 = [strA, strB].join('-');
            const key2 = [strB, strA].join('-');
            if (distances[key1] || distances[key2]) {
                continue;
            }
            distances[key1] = distance(pointA, pointB);
        }
    }
}

// console.log(Object.entries(distances).length);
const shortesNConnections = Object.entries(distances).sort(([ ,v1], [ ,v2]) => v1 - v2).slice(0, n);

console.log(circuits);

for (let index = 0; index < n; index++) {
    const [pointA, pointB] = shortesNConnections[index][0].split('-'); //.map((coordinatesStr) => coordinatesStr.split(','));
    console.log(pointA, pointB);
    
    const circuitsWithAOrB = circuits.filter((c) => c.includes(pointA) || c.includes(pointB));
    console.log(circuitsWithAOrB);
    const newCircuit = Array.from(new Set<string>(circuitsWithAOrB.flat()))
    console.log(newCircuit);

    circuits = circuits.filter((c) => !c.includes(pointA) && !c.includes(pointB)) //.push(newCircuit);
    circuits.push(newCircuit);
    console.log(circuits);
}

circuits.sort((a, b) => b.length - a.length);

// console.log(circuits[0]);
const product = circuits[0].length * circuits[1].length * circuits[2].length;

console.log(product);
