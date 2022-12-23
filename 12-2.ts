const example = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const all =
  <T>(...fs: ((x: T) => boolean)[]) =>
  (x: T) =>
    fs.every(f => f(x));

function compose<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (x: A) => C;
function compose<A, B, C, D>(
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (x: A) => D;
function compose(...fs: ((x: unknown) => unknown)[]): unknown {
  fs.reverse();
  return (x: unknown) => {
    for (const f of fs) x = f(x);
    return x;
  };
}

const a = "a".charCodeAt(0);
const diff = (c: string) => c.charCodeAt(0) - a;
const norm = (c: string) => (c === "S" ? "a" : c === "E" ? "z" : c);

const isStart = (c: string) => c === "a";
const isEnd = (c: string) => c === "E";

const height = compose(diff, norm);
const heights = (row: string[]) => row.map(height);
const initMap = (grid: string[][]) => grid.map(heights);

const infinity = (_: any) => Infinity;
const initSteps = (row: number[]) => row.map(infinity);
const initVisited = (map: number[][]) => map.map(initSteps);

type Pos = { row: number; col: number };

const sameRow = (target: Pos) => (pos: Pos) => pos.row === target.row;
const sameCol = (target: Pos) => (pos: Pos) => pos.col === target.col;
const arrived = (target: Pos) => all(sameRow(target), sameCol(target));

const visit = (visited: number[][]) => (pos: Pos, steps: number) =>
  (visited[pos.row][pos.col] = steps);

const shorter = (visited: number[][]) => (steps: number) => (pos: Pos) =>
  visited[pos.row][pos.col] > steps + 1;

const inbound = (map: number[][]) => (pos: Pos) =>
  0 <= pos.row &&
  pos.row < map.length &&
  0 <= pos.col &&
  pos.col < map[0].length;

const reachable = (map: number[][]) => (from: Pos) => (to: Pos) =>
  map[to.row][to.col] - map[from.row][from.col] <= 1;

const visitable = (map: number[][]) => (from: Pos) =>
  all(inbound(map), reachable(map)(from));

const neighbors = ({ row, col }: Pos) => [
  { row, col: col - 1 },
  { row, col: col + 1 },
  { row: row - 1, col },
  { row: row + 1, col },
];

const reducePos =
  (test: (c: string) => boolean) =>
  <T>(combine: (acc: T, pos: Pos) => T) =>
  (row: number) =>
  (acc: T, c: string, col: number) =>
    test(c) ? combine(acc, { row, col }) : acc;

const collect = <T>(acc: T[], elem: T) => [...acc, elem];
const replace = <T>(acc: T, elem: T) => elem;

const collectStarts = reducePos(isStart)<Pos[]>(collect);
const collectEnd = reducePos(isEnd)<Pos | undefined>(replace);
const reduceEnd = (end: Pos | undefined, cs: string[], row: number) =>
  cs.reduce(collectEnd(row), end);
const reduceStarts = (starts: Pos[], cs: string[], row: number) =>
  cs.reduce(collectStarts(row), starts);
const findEnd = (grid: string[][]) => grid.reduce(reduceEnd, undefined);
const findStarts = (grid: string[][]) => grid.reduce(reduceStarts, []);

const makeWalk = (
  arrived: (pos: Pos) => boolean,
  visit: (pos: Pos, steps: number) => void,
  visitable: (from: Pos) => (to: Pos) => boolean,
  shorter: (steps: number) => (pos: Pos) => boolean,
) =>
  function next(pos: Pos, steps: number) {
    visit(pos, steps);

    if (arrived(pos)) return;

    const toVisit = all(visitable(pos), shorter(steps));
    const goVisit = (neighbor: Pos) => next(neighbor, steps + 1);

    neighbors(pos).filter(toVisit).forEach(goVisit);
  };

const lines = (data: string) => data.split("\n").slice(0, -1);
const toArray = (cs: string) => cs.split("");
const makeGrid = (data: string) => lines(data).map(toArray);

require("fs").readFile("12.txt", "utf-8", (_err: unknown, data: string) => {
  const grid = makeGrid(data);
  const end = findEnd(grid)!;
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
