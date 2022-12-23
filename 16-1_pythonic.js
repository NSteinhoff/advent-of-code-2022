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
const memo = f => {
    const cache = new Map();
    const key = (...args) =>
        args
            .map(a => (Array.isArray(a) ? a.join(",") : a.toString()))
            .join("-");

    return (...args) => {
        const k = key(...args);
        if (!cache.has(k)) cache.set(k, f(...args));
        return cache.get(k);
    };
};

const neq = x => xx => x !== xx;

const re = /Valve (\w+) .*=(\d+); .* valves? (.*)/g;

require("./run")("16")(data => {
    // data = example;
    const [V, F, D] = [new Set(), new Map(), new Map()];

    for (const [_, v, f, us] of data.matchAll(re)) {
        V.add(v);
        if (f !== "0") F.set(v, Number(f));
        for (const u of us.split(", ")) D.set(v + u, 1);
    }

    for (const i of V)
        for (const j of V) if (!D.has(i + j)) D.set(i + j, Infinity);

    for (const k of V)
        for (const i of V)
            for (const j of V)
                D.set(
                    i + j,
                    Math.min(D.get(i + j), D.get(i + k) + D.get(k + j)),
                );

    const search = memo((t, u = "AA", vs = [...F.keys()]) => {
        let best = 0;
        for (const v of vs) {
            if (D.get(u + v) >= t) continue;
            const tt = t - D.get(u + v) - 1;
            const value = F.get(v) * tt + search(tt, v, vs.filter(neq(v)));
            if (value > best) best = value;
        }
        return best;
    });

    return search(30);
});
