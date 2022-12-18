const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const min = (a, b) => (a < b ? a : b);
const max = (a, b) => (a > b ? a : b);
const abs = a => (a < 0 ? -a : a);
const arr = (n, of) => new Array(n).fill(of);
const range = (from, to) =>
    arr(abs(from - to) + 1, from).map((x, i) => x + i * (from < to ? 1 : -1));
const paths = data => data.split("\n").filter(Boolean);
const coords = point => point.split(",").map(Number);
const points = path => path.split(" -> ").map(coords);
const direction = (start, end) => (start[0] === end[0] ? "v" : "h");
const trace = (start, end) =>
    direction(start, end) === "v"
        ? range(start[1], end[1]).map(y => [start[0], y])
        : range(start[0], end[0]).map(x => [x, start[1]]);
const draw = points =>
    points.reduce(
        (points, point) =>
            points.length === 0
                ? [point]
                : [...points.slice(0, -1), ...trace(points.at(-1), point)],
        [],
    );
const parse = data => paths(data).map(points).map(draw).flat();
const dimensions = points =>
    points.reduce(
        (dim, [x, y]) => ({
            x1: min(x, dim.x1),
            x2: max(x, dim.x2),
            y1: min(y, dim.y1),
            y2: max(y, dim.y2),
        }),
        { x1: Infinity, x2: 0, y1: 0, y2: 0 },
    );
const makeMap = points => {
    const { x1, x2, y1, y2 } = dimensions(points);
    const map = range(y1, y2).map(y => range(x1, x2).map(x => "."));
    map.dimensions = { x1, x2, y1, y2 };
    return fill(map, points, x1);
};
const fill = (map, points) => {
    points.forEach(([x, y]) => (map[y][x - map.dimensions.x1] = "#"));
    return map;
};
const paint = map => map.map(row => row.join("")).join("\n");

function* grain() {
    let [x, y] = [500, 0];
    yield [x, y];
    let blocked = false;
    while (true) {
        blocked = yield [x, y + 1];
        if (!blocked) {
            y++;
            continue;
        }

        blocked = yield [x - 1, y + 1];
        if (!blocked) {
            x--;
            y++;
            continue;
        }
        blocked = yield [x + 1, y + 1];
        if (!blocked) {
            x++;
            y++;
            continue;
        }

        return [x, y];
    }
}

const oob =
    map =>
    ([x, y]) =>
        x < map.dimensions.x1 || x > map.dimensions.x2 || y > map.dimensions.y2;
const blocked =
    map =>
    ([x, y]) =>
        map[y][x - map.dimensions.x1] !== ".";
const place =
    map =>
    ([x, y]) =>
        (map[y][x - map.dimensions.x1] = "*");

require("fs").readFile("14.txt", "utf-8", (err, data) => {
    data = example;

    const points = parse(data);
    const map = makeMap(points);
    const isOob = oob(map);
    const isBlocked = blocked(map);
    const settle = place(map);

    let full = false;
    let count = 0;
    for (; !full; count++) {
        const g = grain();
        let blocked = false;
        let n = g.next();
        while (!(n = g.next(isBlocked(n.value))).done) {
            if (isOob(n.value)) {
                full = true;
                break;
            }
        }
        if (full) break;
        settle(n.value);
    }

    console.log(paint(map));
    console.log({ count });
});
