const example = `
30373
25512
65332
33549
35390
`;

const solve = data => {
    const grid = data
        .split("\n")
        .filter(Boolean)
        .map(l => [...l].map(c => Number.parseInt(c, 10)));

    const score = grid.map(row => row.map(_ => 1));

    for (let i = 1; i < grid.length - 1; i++) {
        for (let j = 1; j < grid[i].length - 1; j++) {
            let d, n;

            (d = i), (n = 1);
            while (++d < grid.length - 1 && grid[d][j] < grid[i][j]) n++;
            score[i][j] *= n;

            (d = i), (n = 1);
            while (--d > 0 && grid[d][j] < grid[i][j]) n++;
            score[i][j] *= n;

            (d = j), (n = 1);
            while (++d < grid.length - 1 && grid[i][d] < grid[i][j]) n++;
            score[i][j] *= n;

            (d = j), (n = 1);
            while (--d > 0 && grid[i][d] < grid[i][j]) n++;
            score[i][j] *= n;
        }
    }

    return score.flat().reduce((a, b) => (a > b ? a : b));
};

console.log(solve(example));
require("./run")("8")(solve);
