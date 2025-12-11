import { readFile } from 'fs/promises';
import { init } from 'z3-solver';

const { Context } = await init();
const z3 = Context('main');

// const fileName = 'test.txt';
const fileName = 'input.txt';

const file = await readFile(fileName, 'utf-8');
const lines = file.split('\n');
lines.pop();
const instructions = lines.map(line => {
    const r = line.match(/^\[(.*)\] (\(.*\)) \{(.*)\}/);
    return {
        light: r![1].split('').map(char => char === '#'),
        buttons: r![2].split(' ').map(button => button.slice(1, -1).split(',').map(Number)),
        joltage: r![3].split(',').map(Number),
    };
});

console.log(instructions);

// I cheated and got this hint from reddit: all buttons need to be pressed once or never
// so get all combinations without repeating and sort by length (power set, ignore empty set)
function powerset<T>(arr: T[]): T[][] {
    const result: T[][] = [];
    const total = 1 << arr.length; // 2^n combinations
    for (let mask = 1; mask < total; mask++) { // start at 1 to skip empty set
        const subset: T[] = [];
        for (let i = 0; i < arr.length; i++) {
            if (mask & (1 << i)) {
                subset.push(arr[i]);
            }
        }
        result.push(subset);
    }
    return result.sort((a, b) => a.length - b.length);
}

let unsolved = 0;
let result = 0;
for (const i of instructions) {
    const combinations = powerset(i.buttons).sort((a, b) => a.length - b.length);

    // console.log('---');

    let solution = undefined;
    for (const combination of combinations) {
        // console.log(combination);
        const lights = Array(i.light.length).fill(false);
        for (const toggles of combination) {
            for (const index of toggles) {
                lights[index] = !lights[index];
            }
            // console.log(lights.map(light => light ? '1' : '0').join(''));
        }
        if (lights.every((light, index) => light === i.light[index])) {
            solution = combination;
            break;
        }
    }
    if (!solution) {
        console.error('No solution found:', i);
        unsolved++;
        continue;
    }
    result += solution!.length; 
}

console.log(result);
console.error(unsolved);

// Part 2

// // k-combinations with repetitions

// Reduce the problem space by pruning:
// Start at combinations of length min(joltages)
// Stop at max(joltages)
// Stop as soon as joltage is too high on any index


// function getCombinations<T>(arr: T[], size: number): T[][] {
//     const result: T[][] = [];

//     interface CombinationState<T> {
//         arr: T[];
//         selected: T[];
//         c: number;
//         r: number;
//         start: number;
//         end: number;
//     }

//     const fn = (arr: T[], selected: T[], c: number, r: number, start: number, end: number): void => {
//         if (c === r) {
//         result.push([...selected]);
//         return;
//         }
        
//         for (let i = start; i <= end; i++) {
//         selected[c] = arr[i];
//         fn(arr, selected, c + 1, r, i, end);
//         }
//     }
    
//     fn(arr, [], 0, size, 0, arr.length - 1);
//     return result;
// }

// let result2 = 0;
// for (const i of instructions) {
//     let buttonPresses = Math.min(...i.joltage);
    
//     while (buttonPresses <= Math.max(...i.joltage)) {
//         const combinations = getCombinations(i.buttons, buttonPresses);

//         console.log('trying combinations of len', buttonPresses);

//         let solution = undefined;

//         for (const combination of combinations) {
//             let joltages = Array(i.joltage.length).fill(0);

//             let impossible = false;

//             for (const inputs of combination) {
//                 for (const index of inputs) {
//                     joltages[index]++;
//                     if (joltages.some((joltage, index) => joltage > i.joltage[index])) { // abort if we went too high on one joltage
//                         impossible = true;
//                     }
//                 }
//                 if (impossible) {
//                     break;
//                 }
//             }

//             if (impossible) {
//                 continue;
//             }

//             if (joltages.every((joltage, index) => joltage === i.joltage[index])) {
//                 solution = combination;
//                 break;
//             }
//         }

//         if (solution) {
//             console.log('solution');
//             break;
//         }

//         buttonPresses++;
//     }

//     result2 += buttonPresses;
// }

// console.log(result2);

// Disclaimer: At this point I gave up solving this alone and looked for help. My solution of course only scaled to the test input, even when trying to prune

// New approach: Ax = b
// b is target joltage vector
// x is how many times to press each button
// A is Matrix with the indexes affected as columns

let result2 = 0;

for (const i of instructions) {
    const numButtons = i.buttons.length;
    const numJoltages = i.joltage.length;
    
    // Create integer variables for each button press count
    const x = i.buttons.map((_, idx) => z3.Int.const(`x${idx}`));
    
    const solver = new z3.Optimize();
    
    // Constraint: each button pressed >= 0 times
    for (const xi of x) {
        solver.add(z3.GE(xi, 0)); // greater or equal
    }
    
    // Constraint: for each joltage index, sum of button contributions = target
    for (let j = 0; j < numJoltages; j++) {
        const terms = [];
        for (let b = 0; b < numButtons; b++) {
            if (i.buttons[b].includes(j)) {
                terms.push(x[b]);
            }
        }
        if (terms.length > 0) {
            solver.add(z3.Eq(z3.Sum(...terms), i.joltage[j]));
        } else {
            // No button affects this index - target must be 0
            if (i.joltage[j] !== 0) {
                console.log('Unsolvable: no button affects index', j);
            }
        }
    }
    
    // Minimize total button presses
    solver.minimize(z3.Sum(...x));
    
    const result = await solver.check();
    if (result === 'sat') {
        const model = solver.model();
        const buttonPresses = x.map(xi => Number(model.eval(xi).toString()));
        const buttonPressCount = buttonPresses.reduce((a, b) => a + b, 0);
        console.log('Solution:', buttonPresses, 'Total:', buttonPressCount);

        result2 += buttonPressCount;
    } else {
        console.log('No solution found for:', i);
        process.exit(1);
    }
}

console.log(result2);
