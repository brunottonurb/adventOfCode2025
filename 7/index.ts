import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { createInterface } from 'readline';
import memoize from 'memoize';

const fileName = 'input.txt';

// Part 1

const fileStream = createReadStream(fileName);
const rl = createInterface({
    input: fileStream,
});

let beams: number[] = [];
let index = 0;
let splitCounter = 0;
for await (const line of rl) {
    if (index === 0) {
        beams.push(line.indexOf('S'));
    } else {
        const newBeams: number[] = [];
        
        beams.forEach((beamIndex) => {
            if (line[beamIndex] === '^') {
                splitCounter++;
                if (beamIndex > 0 && !newBeams.includes(beamIndex - 1)) {
                    newBeams.push(beamIndex - 1);
                }
                if (beamIndex + 1 < line.length) {
                    newBeams.push(beamIndex + 1);
                }
            } else {
                if (!newBeams.includes(beamIndex)) {
                    newBeams.push(beamIndex);
                }
            }
        });
        if (index % 2 !== 0) {
            for (let i = 0; i < line.length; i++) {
                process.stdout.write(newBeams.includes(i) ? '\x1b[32m|\x1b[0m' : '.');
            }
            console.log(' ');
        } else {
            for (let i = 0; i < line.length; i++) {
                process.stdout.write(
                    line[i] === '^' ? beams.includes(i) ? '\x1b[32mΔ\x1b[0m' : 'Δ' :
                    newBeams.includes(i) ? '\x1b[32m|\x1b[0m' : '.'
                );
            }
            console.log(' ');
        }
        beams = newBeams;
    }
    index++;
}

console.log(splitCounter);

// Part 2

const file = await readFile(fileName, 'utf-8');
const rows = file.split('\n');
rows.pop();
console.log(rows.join('\n'));

const getTimeLineCount = memoize(
    function(rowIndex: number, columnIndex: number): number {
        console.log('getTimeLineCount', rowIndex, columnIndex);
        if (rowIndex === 0) {
            return 1 + getTimeLineCount(2, rows[0].indexOf('S'));
        } else {
            if (rowIndex < rows.length - 1) {
                if (rows[rowIndex][columnIndex] === '^') {
                    console.log('split');
                    return 1 + getTimeLineCount(rowIndex + 2, columnIndex - 1) + getTimeLineCount(rowIndex + 2, columnIndex + 1);
                } else {
                    return getTimeLineCount(rowIndex + 2, columnIndex);
                }
            } else {
                console.log('end');
                return 0;
            }
        }
    },
    {
        cacheKey: arguments_ => arguments_.join(','),
    },
);

console.log(getTimeLineCount(0, 0));
