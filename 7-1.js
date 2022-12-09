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
            if (dir !== "/") tree.$size += tree[dir].$size;
        } else {
            const [size, file] = line.split(" ");
            tree[file] = Number.parseInt(size, 10);
            tree.$size += tree[file];
        }
    }

    return tree;
};

const tally = (tree) => {
    let sum = 0;
    for (const [k, v] of Object.entries(tree)) {
        if (k === '$size' && v < 100000) sum += v;
        else if (typeof v === 'object') sum += tally(v);
    }

    return sum;
}

const solve = data => {
    const lines = data.split("\n").filter(l => l);

    return tally(walk({}, lines[Symbol.iterator]()));
};

require("fs").readFile("7.txt", "utf-8", (err, data) => {
    console.log(err || solve(data));
});
