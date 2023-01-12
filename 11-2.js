const example = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

require("fs").readFile("11.txt", "utf-8", (err, data) => {
    const monkeys = example
        .split("\n\n")
        .filter(Boolean)
        .map(m => {
            const re =
                /^Monkey (?<n>\d):\n^ +Starting items: (?<items>.*)\n *Operation: new = old (?<op>.) (?<operand>.*)\n *Test: divisible by (?<divisor>\d+)\n *If true: throw to monkey (?<iftrue>\d+)\n *If false: throw to monkey (?<iffalse>\d+)/gm;
            const match = re.exec(m);

            const { n, items, op, operand, divisor, iftrue, iffalse } =
                match.groups;

            return {
                n: Number(n),
                items: items.split(", ").map(n => Number(n)),
                operation: old => {
                    const rhs = operand === "old" ? old : Number(operand);
                    return op === "+" ? old + rhs : old * rhs;
                },
                divisor: Number(divisor),
                iftrue: Number(iftrue),
                iffalse: Number(iffalse),
                count: 0,
            };
        });

    const divisorProduct = monkeys.reduce((p, m) => p * m.divisor, 1);

    for (let round = 1; round <= 10_000; round++) {
        for (const monkey of monkeys) {
            const { operation, divisor, items, iftrue, iffalse } = monkey;

            let item;
            while ((item = items.pop()) !== undefined) {
                monkey.count++;
                const level = operation(item) % divisorProduct;
                const destination = level % divisor === 0 ? iftrue : iffalse;
                monkeys[destination].items.push(level);
            }
        }
    }

    const counts = monkeys.map(monkey => monkey.count);
    const [first, second] = counts.sort((a, b) => b - a).slice(0, 2);
    console.log({counts, score: first * second});
});
