const EXAMPLE: &str = r"A Y
B X
C Z";

fn solve(input: &str) -> i32 {
    input
        .lines()
        .map(|line| match line {
            "A X" => 0 + 3,
            "A Y" => 3 + 1,
            "A Z" => 6 + 2,
            "B X" => 0 + 1,
            "B Y" => 3 + 2,
            "B Z" => 6 + 3,
            "C X" => 0 + 2,
            "C Y" => 3 + 3,
            "C Z" => 6 + 1,
            _ => panic!("Invalid input {}", line),
        })
        .sum()
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Problem: {}", solve(&std::fs::read_to_string("../2.txt")?));
    Ok(())
}
