const example = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const re =
    /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/;

const sorted = s => [...s].sort((a, b) => a - b);
const abs = a => (a < 0 ? -a : a);
const entries = o => Object.entries(o);
const obj = entries => Object.fromEntries(entries);
const mapvals = f => o => obj(entries(o).map(([k, v]) => [k, f(v)]));
const lines = data => data.split("\n").filter(Boolean);
const matches = line => re.exec(line).groups;
const tonumber = mapvals(Number);
const parse = data => lines(data).map(matches).map(tonumber).map(tosensor);
const tosensor = ({ sx, sy, bx, by }) => {
    const sensor = { x: sx, y: sy };
    const beacon = { x: bx, y: by };
    return { sensor, beacon, distance: distance(sensor, beacon) };
};
const distance = (s, b) => abs(s.x - b.x) + abs(s.y - b.y);
const covered = row => (acc, sensor) => {
    let y = row;
    const s = sensor.sensor;
    const d = sensor.distance;
    for (let x = s.x; distance(s, { y, x }) <= d; x++) acc.add(x);
    for (let x = s.x; distance(s, { y, x }) <= d; x--) acc.add(x);
    return acc;
};
const coverage = sensors => row => {
    const xs = sensors.reduce(covered(row), new Set());
    sensors
        .map(s => s.beacon)
        .filter(b => b.y === row)
        .forEach(b => xs.delete(b.x));
    return xs;
};

require("fs").readFile("15.txt", "utf-8", (err, data) => {
    let row = 2000000;
    // data = example; row = 10;
    const sensors = parse(data);
    const result = coverage(sensors)(row);
    console.log({size: result.size});
});
