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

const pairs = data =>
    data
        .split("\n")
        .filter(Boolean)
        .map(line => JSON.parse(line))
        .reduce((pairs, line, i) => {
            if (i % 2 === 0) pairs.push([line]);
            else pairs.at(-1)[1] = line;
            return pairs;
        }, []);

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
}

require("fs").readFile("13.txt", "utf-8", (err, data) => {
    // data = example;
    const result = pairs(data).map(pair => compare(...pair));

    const sum = result.reduce(
        (sum, comparison, i) => (comparison < 0 ? sum + i + 1 : sum),
        0,
    );

    console.log(sum);
});
