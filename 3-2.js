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
        .reduce((groups, line, i) => {
            if (i % 3 === 0) groups.push([line]);
            else groups[groups.length - 1].push(line);
            return groups;
        }, [])
        .map(([a, b, c]) => [new Set(a), new Set(b), new Set(c)])
        .map(([a, b, c]) => [...a].find(aa => b.has(aa) && c.has(aa)))
        .map(priority)
        .reduce((total, p) => total + p, 0);

    console.log(results);
});
