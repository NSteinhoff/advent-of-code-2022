const EXAMPLE: &str = r"    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2";

fn solve(input: &str) -> String {
    let mut stacks: Vec<Vec<char>> = vec![];
    let mut lines = input.lines();

    let layout = lines
        .by_ref()
        .take_while(|line| !line.is_empty())
        .filter(|line| !line.starts_with(" 1"));

    for line in layout {
        for (i, c) in line.char_indices().filter(|(i, c)| i % 4 == 1 && *c != ' ') {
            let ii: usize = (i - 1) / 4;
            while stacks.len() < ii + 1 {
                stacks.push(Vec::new());
            }
            stacks.get_mut(ii).map(|s| s.push(c));
        }
    }

    for stack in stacks.iter_mut() {
        stack.reverse();
    }

    let commands = lines.by_ref().skip_while(|line| line.is_empty());

    for command in commands {
        let mut idcs = command
            .split(" ")
            .skip(1)
            .step_by(2)
            .map(|n| n.parse::<usize>().expect("Must be a numbers!"));
        let n = idcs.next().expect("Must have an amount!");
        let from = idcs.next().expect("Must have a 'from'");
        let to = idcs.next().expect("Must have a 'to'");
        for _ in 0..n {
            let from = stacks
                .get_mut(from - 1)
                .expect("'from' stack should have been created!");
            let c = from.pop().expect("'from' stack should not be empty!");
            let to = stacks
                .get_mut(to - 1)
                .expect("'to' stack should have been created!");
            to.push(c);
        }
    }

    let tops: Vec<String> = stacks
        .iter_mut()
        .map(|stack| stack.pop().expect("Stack should not be empty!").to_string())
        .collect();

    tops.join("")
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Problem: {}", solve(&std::fs::read_to_string("../5.txt")?));
    Ok(())
}
