const EXAMPLE: &str = r"vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw";

/// Partition into two equal length parts
fn partition(s: &str) -> (&str, &str) {
    assert!(s.len() % 2 == 0);
    s.split_at(s.len() / 2)
}

/// Return the numeric priority of each char
fn priority(c: char) -> i32 {
    match c {
        'a'..='z' => 1 + c as i32 - 'a' as i32,
        'A'..='Z' => 27 + c as i32 - 'A' as i32,
        _ => panic!("Invalid character '{}'", c),
    }
}

/// Return the single duplicate character
fn duplicate((left, right): (&str, &str)) -> char {
    left.chars()
        .find(|&c| right.contains(c))
        .expect("There must be a duplicate!")
}

fn solve(input: &str) -> i32 {
    input
        .lines()
        .map(partition)
        .map(duplicate)
        .map(priority)
        .sum()
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Example: {}", solve(&std::fs::read_to_string("../3.txt")?));
    Ok(())
}
