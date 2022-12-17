const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

function walk(map, { row, col }, target, steps, visited) {
    visited[row][col] = steps;

    if (row === target.row && col === target.col) return;

    const height = map[row][col];

    [
        { row, col: col - 1 },
        { row, col: col + 1 },
        { row: row - 1, col },
        { row: row + 1, col },
    ]
        .filter(
            ({ row, col }) =>
                0 <= row &&
                row < map.length &&
                0 <= col &&
                col < map[0].length &&
                map[row][col] - height <= 1 &&
                visited[row][col] > steps + 1,
        )
        .forEach(next => walk(map, next, target, steps + 1, visited));
}

require("fs").readFile("12.txt", "utf-8", (err, data) => {
    const grid = data
        .split("\n")
        .filter(Boolean)
        .map(row => [...row]);

    const { start, end } = grid.reduce(({ start, end }, row, i) => {
        const { start: startCol, end: endCol } = row.reduce(
            ({ start, end }, c, j) => ({
                start: c === "S" ? j : start,
                end: c === "E" ? j : end,
            }),
            {},
        );

        return {
            start: startCol !== undefined ? { row: i, col: startCol } : start,
            end: endCol !== undefined ? { row: i, col: endCol } : end,
        };
    }, {});

    const map = grid.map(row =>
        row
            .map(c => (c === "S" ? "a" : c === "E" ? "z" : c))
            .map(c => c.charCodeAt(0) - "a".charCodeAt(0) + 1),
    );

    const visited = map.map(row => row.map(_ => Infinity));

    walk(map, start, end, 0, visited);

    console.log({steps: visited[end.row][end.col] });
});
