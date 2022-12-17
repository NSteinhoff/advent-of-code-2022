const example = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const parse = data =>
    data
        .split("\n")
        .filter(Boolean)
        .map(line => JSON.parse(line));

const num = n => typeof n === "number";
const empty = a => a.length === 0;

const compare = (left, right) => {
    if (num(left) && num(right)) return left - right;
    if (num(left)) return compare([left], right);
    if (num(right)) return compare(left, [right]);
    if (empty(left) && empty(right)) return 0;
    if (empty(left)) return -1;
    if (empty(right)) return 1;
    return compare(left[0], right[0]) || compare(left.slice(1), right.slice(1));
};

require("fs").readFile("13.txt", "utf-8", (err, data) => {
    // data = example;
    const packets = parse(data);
    const dividers = [[[2]], [[6]]];
    packets.push(...dividers);
    const sorted = packets.sort(compare);
    const isDivider = p => dividers.some(d => p === d);
    const reduceKey = (k, p, i) => (isDivider(p) ? k * (i + 1) : k);
    const key = sorted.reduce(reduceKey, 1);
    console.log(key);
});
