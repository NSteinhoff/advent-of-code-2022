const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const all =
    (...fs) =>
    x =>
        fs.every(f => f(x));

const compose = (...fs) => {
    fs.reverse();
    return x => {
        for (const f of fs) x = f(x);
        return x;
    };
};

const collect = (acc, elem) => [...acc, elem];
const replace = (acc, elem) => elem;

const a = "a".charCodeAt(0);
const diff = c => c.charCodeAt(0) - a;
const norm = c => (c === "S" ? "a" : c === "E" ? "z" : c);

const isStart = c => c === "a";
const isEnd = c => c === "E";

const height = compose(diff, norm);
const heights = row => row.map(height);
const initMap = grid => grid.map(heights);

const infinity = _ => Infinity;
const initSteps = row => row.map(infinity);
const initVisited = map => map.map(initSteps);

const sameRow = target => pos => pos.row === target.row;
const sameCol = target => pos => pos.col === target.col;
const arrived = target => all(sameRow(target), sameCol(target));

const visit = visited => (pos, steps) => (visited[pos.row][pos.col] = steps);

const shorter = visited => steps => pos =>
    visited[pos.row][pos.col] > steps + 1;

const inbound = map => pos =>
    0 <= pos.row &&
    pos.row < map.length &&
    0 <= pos.col &&
    pos.col < map[0].length;

const reachable = map => from => to =>
    map[to.row][to.col] - map[from.row][from.col] <= 1;

const visitable = map => from => all(inbound(map), reachable(map)(from));

const neighbors = ({ row, col }) => [
    { row, col: col - 1 },
    { row, col: col + 1 },
    { row: row - 1, col },
    { row: row + 1, col },
];

const reducePos = test => combine => row => (acc, c, col) =>
    test(c) ? combine(acc, { row, col }) : acc;

const collectStarts = reducePos(isStart)(collect);
const collectEnd = reducePos(isEnd)(replace);
const reduceEnd = (end, cs, row) => cs.reduce(collectEnd(row), end);
const reduceStarts = (starts, cs, row) => cs.reduce(collectStarts(row), starts);
const findEnd = grid => grid.reduce(reduceEnd, undefined);
const findStarts = grid => grid.reduce(reduceStarts, []);

const makeWalk = (arrived, visit, visitable, shorter) =>
    function next(pos, steps) {
        visit(pos, steps);

        if (arrived(pos)) return;

        const toVisit = all(visitable(pos), shorter(steps));
        const goVisit = neighbor => next(neighbor, steps + 1);

        neighbors(pos).filter(toVisit).forEach(goVisit);
    };

const lines = data => data.split("\n").slice(0, -1);
const toArray = cs => [...cs];
const makeGrid = data => lines(data).map(toArray);

require("fs").readFile("12.txt", "utf-8", (err, data) => {
    const grid = makeGrid(data);
    const end = findEnd(grid);
    const starts = findStarts(grid);
    const map = initMap(grid);
    const visited = initVisited(map);

    const walk = makeWalk(
        arrived(end),
        visit(visited),
        visitable(map),
        shorter(visited),
    );

    starts.forEach(start => walk(start, 0));

    console.log({
        starts: starts.length,
        end,
        steps: visited[end.row][end.col],
    });
});
