const example = `
30373
25512
65332
33549
35390
`;

require("fs").readFile("8.txt", "utf-8", (err, data) => {
    const grid = data
        .split("\n")
        .filter(Boolean)
        .map(l => [...l].map(c => Number.parseInt(c, 10)));

    const visibility = grid.map(row => row.map(_ => 0));

    for (let i = 0; i < grid.length; i++) {
        let left, right, top, bottom;
        left = right = top = bottom = -1;
        for (let j = 0; j < grid[i].length; j++) {
            const jj = grid[i].length - 1 - j;

            if (grid[i][j] > left) {
                visibility[i][j] = 1;
                left = grid[i][j];
            }

            if (grid[i][jj] > right) {
                visibility[i][jj] = 1;
                right = grid[i][jj];
            }

            if (grid[j][i] > top) {
                visibility[j][i] = 1;
                top = grid[j][i];
            }

            if (grid[jj][i] > bottom) {
                visibility[jj][i] = 1;
                bottom = grid[jj][i];
            }
        }
    }

    const count = visibility
        .flat()
        .reduce((a, b) => a + b, 0);

    const result = { grid, visibility, count };

    console.log(result);
});
