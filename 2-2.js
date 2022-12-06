const shapes = {
    A: "rock",
    B: "paper",
    C: "scissors",
};

const outcomes = {
    X: "loss",
    Y: "draw",
    Z: "win",
}

const responses = {
    rock: {
        draw: "rock",
        loss: "scissors",
        win: "paper",
    },
    paper: {
        draw: "paper",
        loss: "rock",
        win: "scissors",
    },
    scissors: {
        draw: "scissors",
        loss: "paper",
        win: "rock",
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
            const [theirs, ours] = line.split(" ")
            const outcome = outcomes[ours];
            const response = responses[shapes[theirs]][outcome]
            return points[outcome] + points[response];
        })
        .reduce((total, round) => total + round, 0);

    console.log(score);
});
