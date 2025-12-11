import { readFile } from 'fs/promises';

// const fileName = 'test.txt';
const fileName = 'input.txt';

const file = await readFile(fileName, 'utf-8');
const lines = file.split('\n');
lines.pop();

const adjacencyList = new Map<string, string[]>();

for (const line of lines) {
    const [device, outputs] = line.split(': ').map((fragment, index) => index === 1 ? fragment.split(' ') : fragment) as [string, string[]];
    adjacencyList.set(device, outputs);
}

console.log(adjacencyList);

// use depth-first search
// https://fireship.io/courses/javascript/interview-graphs/
// assuming there are no cycles (infinite solutions?)
function countConnections(start: string, target: string) {
    console.log(start);
    return adjacencyList.get(start)!.reduce((count, destination) => {
        if (destination === target) {
            console.log('reached out!');
            count++;
        } else {
            count += countConnections(destination, target);
        }
        return count;
    }, 0);
}

console.log(countConnections('you', 'out'));
