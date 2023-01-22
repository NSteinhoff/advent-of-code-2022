const EXAMPLE: &str = r"    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2";

use std::collections::VecDeque;

type Stack = VecDeque<char>;

fn solve(input: &str) -> String {
    let mut stacks: Vec<Stack> = vec![];
    let mut lines = input.lines();

    lines
        .by_ref()
        .take_while(|line| !line.is_empty())
        .filter(|line| !line.starts_with(" 1"))
        .for_each(|line| {
            line.char_indices()
                .filter(|(i, c)| i % 4 == 1 && *c != ' ')
                .for_each(|(i, c)| {
                    let ii: usize = (i - 1) / 4;
                    while stacks.len() < ii + 1 {
                        stacks.push(VecDeque::new());
                    }
                    stacks.get_mut(ii).map(|s| s.push_front(c));
                });
        });

    lines
        .by_ref()
        .skip_while(|line| line.is_empty())
        .map(|line| {
            let mut idcs = line.split(" ").skip(1).step_by(2).map(|n| {
                n.parse::<usize>()
                    .map_err(|_| format!("Parse error: {} is not a usize", n))
            });
            let n = idcs.next().ok_or("Missing amount!".to_owned())??;
            let from = idcs.next().ok_or("Missing 'from'".to_owned())??;
            let to = idcs.next().ok_or("Missing 'to'".to_owned())??;
            Ok((n, from - 1, to - 1))
        })
        .filter_map(|command: Result<(usize, usize, usize), String>| {
            command
                .map_err(|msg| {
                    println!("Invalid command: {}", msg);
                    msg
                })
                .ok()
        })
        .for_each(|(n, from, to)| {
            let mut hold: Vec<Result<char, &str>> = Vec::new();
            for _ in 0..n {
                let c = stacks
                    .get_mut(from)
                    .ok_or("Stack 'from' missing!")
                    .and_then(|stack| stack.pop_back().ok_or("Stack 'from' empty!"));
                hold.push(c);
            }
            for _ in 0..n {
                let result = hold.pop().ok_or("Hold stack is empty").and_then(|c| {
                    c.and_then(|c| {
                        stacks
                            .get_mut(to)
                            .ok_or("Stack 'to' missing!")
                            .map(|stack| stack.push_back(c))
                    })
                });
                if let Err(msg) = result {
                    println!("Unable to move from {} to {}: {}", from, to, msg);
                }
            }
        });

    let tops: Vec<String> = stacks
        .iter_mut()
        .filter_map(|stack| stack.pop_back().map(|c| c.to_string()))
        .collect();

    tops.join("")
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Problem: {}", solve(&std::fs::read_to_string("../5.txt")?));
    Ok(())
}
