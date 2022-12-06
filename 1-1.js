require("fs").readFile("1.txt", "utf-8", (_, data) => {
    const maxCalories = data.split("\n").reduce(
        ({ max, calories }, line) => {
            const next = line === "" ? 0 : calories + Number.parseInt(line, 10);
            return { max: next > max ? next : max, calories: next };
        },
        { max: 0, calories: 0 },
    ).max;

    console.log(maxCalories);
});
