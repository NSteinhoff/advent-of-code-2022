const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const min = (a, b) => (a < b ? a : b);
const max = (a, b) => (a > b ? a : b);
const abs = a => (a < 0 ? -a : a);
const arr = (n, of) => new Array(n).fill(0).map(of);
const range = (from, to) =>
    arr(abs(from - to) + 1, () => from).map(
        (x, i) => x + i * (from < to ? 1 : -1),
    );

const paths = data => data.split("\n").filter(Boolean);
const coords = point => point.split(",").map(Number);
const points = path => path.split(" -> ").map(coords);
const trace = (start, end) =>
    start[0] === end[0]
        ? range(start[1], end[1]).map(y => [start[0], y])
        : range(start[0], end[0]).map(x => [x, start[1]]);

const connect = points =>
    points.reduce(
        (points, point) =>
            points.length === 0
                ? [point]
                : [...points.slice(0, -1), ...trace(points.at(-1), point)],
        [],
    );
const parse = data => paths(data).map(points).map(connect).flat();

const findBottom = points => points.reduce((b, [_, y]) => max(y, b), 0) + 2;

const makeMap = points => {
    const bottom = findBottom(points);
    const map = arr(bottom, () => new Array());
    map.bottom = bottom;
    points.forEach(([x, y]) => (map[y][x] = "#"));
    return map;
};

const parseMap = data => makeMap(parse(data));

function* moves([x, y]) {
    yield [x, y + 1];
    yield [x - 1, y + 1];
    yield [x + 1, y + 1];
}

function* grain(place) {
    let pos = [500, 0];
    let settled = false;

    const settle = pos => {
        place(pos);
        settled = true;
    };

    for (let blocked; !settled; blocked && settle(pos)) {
        for (const move of moves(pos)) {
            if (!(blocked = yield move)) {
                pos = move;
                break;
            }
        }
    }

    return pos;
}

const isOrigin =
    map =>
    ([x, y]) =>
        x === 500 && y === 0;

const blocked =
    map =>
    ([x, y]) =>
        y >= map.bottom || map[y][x] === "#" || map[y][x] === "*";

const settle =
    map =>
    ([x, y]) =>
        (map[y][x] = "*");

require("fs").readFile("14.txt", "utf-8", (err, data) => {
    // data = example;
    const map = parseMap(data);
    let count = 0;
    const dropSand = () => grain(settle(map));

    for (let pos, g; !(pos && isOrigin(map)(pos.value)); count++) {
        path = dropSand();
        while (!(pos = path.next(pos && blocked(map)(pos.value))).done);
    }
    console.log({ count });
});
