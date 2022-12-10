const example = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const peek = elem => {
    console.log(elem);
    return elem;
};

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

                const nextTails = tails.at(-1).map((tail) => {
                    let { x, y } = tail;

                    const dx = head.x - x;
                    const dy = head.y - y;
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                        x = dx === 0 ? x : dx > 0 ? x + 1 : x - 1;
                        y = dy === 0 ? y : dy > 0 ? y + 1 : y - 1;
                    }

                    head = { x, y };
                    return {x, y};
                });

                tails.push(nextTails);
                return tails;
            },
            [new Array(9).fill(0).map(v => ({ x: v, y: v }))],
        )
        .reduce((positions, tails) => {
            const { x, y } = tails.at(-1);
            positions.add(`${x},${y}`);
            return positions;
        }, new Set());

    console.log(steps.size);
});
