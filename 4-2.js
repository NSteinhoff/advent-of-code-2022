require("fs").readFile("4.txt", "utf-8", (err, data) => {
    const result =
        err ||
        data
            .split("\n")
            .filter(l => l)
            .map(l => l.split(","))
            .map(rs =>
                rs.map(r => r.split("-").map(num => Number.parseInt(num, 10))),
            )
            .filter(
                ([[a1, a2], [b1, b2]]) =>
                    (a1 <= b1 && b1 <= a2) ||
                    (a1 <= b2 && b2 <= a2) ||
                    (b1 <= a1 && a1 <= b2) ||
                    (b1 <= a2 && a2 <= b2),
            ).length;

    console.log(result);
});
