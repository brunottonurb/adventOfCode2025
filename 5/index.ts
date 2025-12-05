import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const fileStream = createReadStream('input.txt');
const rl = createInterface({
    input: fileStream,
});

const ranges: [number, number][] = [];
const freshIds: number[] = [];

let parsingRanges = true;
for await (const line of rl) {
    if (line === "") {
        parsingRanges = false;
    } else {
        if (parsingRanges) {
            const [first, last] = line.split('-').map(Number);

            if (last < first || first < 0 || last < 0) {
                console.error('\x1b[31m%s\x1b[0m', line);
                process.exit(1);
            }

            // shorten the range
            let [result, overflow] = shortenIfNecessary(ranges, first, last);
            if (result) ranges.push(result);
            console.log('result:', result, 'overflow:', overflow);
            while (overflow !== null) {
                [result, overflow] = shortenIfNecessary(ranges, overflow[0], overflow[1]);
                if (result) ranges.push(result);
                console.log('result:', result, 'overflow:', overflow);
            }
            console.log('-');
        } else {
            const id = Number(line);
            if (ranges.some(([x, y]) => x <= id && id <= y)) {
                freshIds.push(id);
            }
        }
    }
}

function shortenIfNecessary(ranges: [number, number][], first: number, last: number): [[number, number] | null, [number, number] | null] {
    console.log([first, last]);
    let newRange: [number, number] = [first, last];
    let overflow: [number, number] | null = null;
    for (const range of ranges) {
        // console.log(' ', ranges);
        if (newRange[0] >= range[0] && newRange[0] <= range[1]) {
            if (newRange[1] <= range[1]) {
                console.log(`is in [${range}]`);
                return [null, overflow];
            }
            if (range[1] < newRange[1]) {
                newRange = [range[1] + 1, newRange[1]];
                console.log(`overlaps at the end of [${range}]: new [${newRange}]`);
                continue;
            } else {
                console.log(`not valid range: [${[range[1] + 1, newRange[1]]}]`);
                return [null, overflow];
            }
        } else if (newRange[1] >= range[0] && newRange[1] <= range[1]) {
            if (newRange[0] < range[0]) {
                newRange = [newRange[0], range[0] - 1];
                console.log(`overlaps at the beginning of [${range}]: new [${newRange}]`);
                continue;
            } else {
                console.log(`not valid range: [${[newRange[0], range[0] - 1]}]`);
                return [null, overflow];
            }
        } else if (newRange[0] < range[0] && range[1] < newRange[1]) {
            // we need to add two ranges!
            const t = newRange[1];
            newRange = [newRange[0], range[0] - 1];
            overflow = [range[1] + 1, t];
            continue;
        }
    }
    return [newRange, overflow];
}

console.log(freshIds.length);

const allPossibleIdsCount = ranges.reduce((count, current) => count + (current[1] + 1 - current[0]), 0);

console.log(allPossibleIdsCount);
