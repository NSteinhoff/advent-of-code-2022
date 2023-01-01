//   a1....a2
// b1.........b2
//      OR
// a1.........a2
//   b1...b2
require("./run")("4")(
    data =>
        data
            .split("\n")
            .filter(l => l)
            .map(l => l.split(","))
            .map(rs =>
                rs.map(r => r.split("-").map(num => Number.parseInt(num, 10))),
            )
            .filter(
                ([[a1, a2], [b1, b2]]) =>
                    // (a1 <= b1 && b2 <= a2) || (b1 <= a1 && a2 <= b2),
                    (a1 - b1) * (a2 - b2) <= 0,
            ).length,
);
