const EXAMPLE: &str = r"vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw";

const N: usize = 3;

use std::collections::{HashMap, HashSet};

/// Return the numeric priority of each char
fn priority(c: char) -> i32 {
    match c {
        'a'..='z' => 1 + c as i32 - 'a' as i32,
        'A'..='Z' => 27 + c as i32 - 'A' as i32,
        _ => panic!("Invalid character '{}'", c),
    }
}

fn solve(input: &str) -> i32 {
    let mut priorities: Vec<i32> = Vec::new();
    let mut counts: HashMap<char, usize> = HashMap::new();

    for (i, line) in input.lines().enumerate() {
        let mut chars: HashSet<char> = HashSet::new();
        line.chars().for_each(|c| _ = chars.insert(c));

        chars
            .into_iter()
            .for_each(|c| *counts.entry(c).or_insert(0) += 1);

        if i % N == N - 1 {
            counts
                .iter()
                .find(|(&_, &v)| v == N)
                .map(|(&k, _)| priorities.push(priority(k)));
            counts.clear();
        }
    }

    priorities.iter().sum()
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Example: {}", solve(&std::fs::read_to_string("../3.txt")?));
    Ok(())
}
