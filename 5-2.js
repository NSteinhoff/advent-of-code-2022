require("fs").readFile("5.txt", "utf-8", (err, data) => {
    const stacks = [];
    for (let i = 0; i < 9; i++) stacks.push([]);

    const iterlines = data.split("\n")[Symbol.iterator]();

    for (const line of iterlines) {
        if (line.startsWith(" 1")) continue;
        if (!line) break;
        stacks.forEach((s, i) => {
            const char = line.charAt(i * 4 + 1);
            if (char && char !== " ") s.unshift(char);
        });
    }

    const hold = [];
    for (const line of iterlines) {
        if (!line) break;
        let [move, n, from, a, to, b] = line.split(" ");
        while (n-- > 0) hold.push(stacks[a - 1].pop());
        while (hold.length > 0) stacks[b - 1].push(hold.pop());
    }

    console.log(stacks.map(s => s.pop()).join(""));
});
