const example = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

const walk = (tree, iterlines) => {
    for (const line of iterlines) {
        if (line.startsWith("$ ls")) continue;
        if (line.startsWith("dir")) continue;
        if (line.startsWith("$ cd")) {
            const [p, cd, dir] = line.split(" ");
            if (dir === "..") break;
            tree[dir] = walk({ $size: 0 }, iterlines);
            tree.$size += tree[dir].$size;
        } else {
            const [size, file] = line.split(" ");
            tree[file] = Number.parseInt(size, 10);
            tree.$size += tree[file];
        }
    }

    return tree;
};

const find = (size, tree) => {
    const recur = (tree, min) => {
        for (const [k, v] of Object.entries(tree)) {
            if (typeof v === "object" && v.$size > size) {
                const sub = recur(v, v.$size);
                if (sub < min) min = sub;
            }
        }
        return min;
    };

    return recur(tree, tree.$size);
};

const solve = data => {
    const lines = data.split("\n").filter(l => l);
    const tree = walk({ $size: 0 }, lines[Symbol.iterator]());
    const tofree = 30000000 - 70000000 + tree.$size;
    return find(tofree, tree);
};

console.log(solve(example));
require("./run")("7")(solve);
