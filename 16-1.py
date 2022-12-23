import collections as c, itertools, functools, re

r = r"Valve (\w+) .*=(\d*); .* valves? (.*)"

V, F, D = set(), dict(), c.defaultdict(lambda: 1000)

for v, f, us in re.findall(r, open("16.txt").read()):
    V.add(v)  # store node
    if f != "0":
        F[v] = int(f)  # store flow
    for u in us.split(", "):
        D[u, v] = 1  # store dist

for k, i, j in itertools.product(V, V, V):  # floyd-warshall
    D[i, j] = min(D[i, j], D[i, k] + D[k, j])


@functools.cache
def search(t, u="AA", vs=frozenset(F)):
    return max(
        [
            F[v] * (t - D[u, v] - 1) + search(t - D[u, v] - 1, v, vs - {v})
            for v in vs
            if D[u, v] < t
        ]
        + [0]
    )


print(search(30))
