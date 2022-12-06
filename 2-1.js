const shapes = {
    A: "rock",
    B: "paper",
    C: "scissors",
    X: "rock",
    Y: "paper",
    Z: "scissors",
};

const outcomes = {
    rock: {
        rock: "draw",
        paper: "loss",
        scissors: "win",
    },
    paper: {
        rock: "win",
        paper: "draw",
        scissors: "loss",
    },
    scissors: {
        rock: "loss",
        paper: "win",
        scissors: "draw",
    },
};

const points = {
    rock: 1,
    paper: 2,
    scissors: 3,
    loss: 0,
    draw: 3,
    win: 6,
};

require('fs').readFile("2.txt", "utf-8", (err, data) => {
    const score = data
        .split("\n")
        .filter(line => line)
        .map(line => {
            const [theirs, ours] = line
                .split(" ")
                .map(c => shapes[c]);

            const outcome = outcomes[ours][theirs];
            return points[outcome] + points[ours];
        })
        .reduce((total, round) => total + round, 0);

    console.log(score);
});
