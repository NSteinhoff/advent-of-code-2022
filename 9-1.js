const example = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

require("fs").readFile("9.txt", "utf-8", (err, data) => {
    const steps = data
        .split("\n")
        .filter(Boolean)
        .map(l => l.split(" "))
        .reduce((steps, [direction, amount]) => {
            while (amount--) steps.push(direction);
            return steps;
        }, [])
        .reduce(
            (heads, s) => {
                const { x, y } = heads[heads.length - 1];
                heads.push({
                    x: s === "L" ? x - 1 : s === "R" ? x + 1 : x,
                    y: s === "D" ? y - 1 : s === "U" ? y + 1 : y,
                });
                return heads;
            },
            [{ x: 0, y: 0 }],
        )
        .reduce(
            (tails, head) => {
                let { x, y } = tails[tails.length - 1];

                const dx = head.x - x;
                const dy = head.y - y;
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    x = dx === 0 ? x : dx > 0 ? x + 1 : x - 1;
                    y = dy === 0 ? y : dy > 0 ? y + 1 : y - 1;
                }

                tails.push({ x, y });
                return tails;
            },
            [{ x: 0, y: 0 }],
        )
        .reduce(
            (positions, tail) => {
                positions.add(`${tail.x},${tail.y}`);
                return positions;
            },
            new Set(),
        );

    console.log(steps.size);
});
