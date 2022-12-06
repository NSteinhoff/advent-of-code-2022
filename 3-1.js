const point = c => c.codePointAt(0);
const a = point("a");
const A = point("A");

const priority = c => {
    const p = point(c);
    return p >= a ? p - a + 1 : p - A + 27;
};

require("fs").readFile("3.txt", "utf-8", (err, data) => {
    const results = data
        .split("\n")
        .filter(l => l)
        .map(l => [
            new Set(l.slice(0, l.length / 2)),
            new Set(l.slice(l.length / 2)),
        ])
        .map(([left, right]) => [...left].find(l => right.has(l)))
        .map(priority)
        .reduce((total, p) => total + p, 0);

    console.log(results);
});
