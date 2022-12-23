const example = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const re = /Valve (\w+) .*=(\d+); .* valves? (.*)/g;

const memo = f => {
    const cache = new Map();
    const key = (...args) =>
        args.map(a => (Array.isArray(a) ? a.join(",") : a)).join("-");

    return (...args) => {
        const k = key(...args);
        if (!cache.has(k)) cache.set(k, f(...args));
        return cache.get(k);
    };
};

const solve = data => {
    const [vs, fs, ds] = parse(data);
    floydWarshall(get(ds))(set(ds))(vs);
    return search(get(ds))(v => fs.get(v))(26, "AA", [...fs.keys()], true);
};
const parse = data =>
    [...data.matchAll(re)].reduce(collect, [new Set(), new Map(), new Map()]);
const collect = ([vs, fs, ds], [_, v, f, us]) => {
    vs.add(v);
    if (f !== "0") fs.set(v, Number(f));
    us.split(", ").forEach(u => set(ds)(u, v, 1));
    return [vs, fs, ds];
};
const set = ds => (a, b, v) => ds.set(a + b, v);
const get = ds => (a, b) => ds.get(a + b) ?? Infinity;
const floydWarshall = get => set => vs => {
    product(vs).forEach(([k, i, j]) => {
        set(i, j, Math.min(get(i, j), get(i, k) + get(k, j)));
    });
};
const product = vs => {
    const p = [];
    vs.forEach(v => vs.forEach(vv => vs.forEach(vvv => p.push([v, vv, vvv]))));
    return p;
};
const search = d => f => {
    const recur = memo((t, u, vs, e) =>
        vs
            .filter(v => d(u, v) < t)
            .map(
                v =>
                    f(v) * (t - d(u, v) - 1) +
                    recur(t - d(u, v) - 1, v, vs.filter(neq(v)), e),
            )
            .reduce(max, e ? recur(26, "AA", vs) : 0),
    );
    return recur;
};
const neq = x => xx => x !== xx;
const max = (acc, v) => (v > acc ? v : acc);

require("./run")("16")(data => solve(data));
