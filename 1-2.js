require("fs").readFile("1.txt", "utf-8", (_, data) => {
    const calories = data.split("\n").reduce(
        (acc, line) => {
            if (line === "") acc.push(0);
            else acc[acc.length - 1] += Number.parseInt(line, 10);

            return acc;
        },
        [0],
    );

    calories.sort((a, b) => b - a);
    console.log(calories.slice(0, 3).reduce((a, b) => a + b));
});
