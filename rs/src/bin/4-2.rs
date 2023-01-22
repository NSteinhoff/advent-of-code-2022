const EXAMPLE: &str = r"2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8";

fn parse_range(s: &str) -> Option<(i32, i32)> {
    let (start, end) = s.split_once("-")?;
    Some((start.parse().ok()?, end.parse().ok()?))
}

fn solve(input: &str) -> usize {
    input
        .lines()
        .filter_map(|l| l.split_once(","))
        .filter_map(|(left, right)| Some((parse_range(left)?, parse_range(right)?)))
        .filter(|((a1, a2), (b1, b2))| (a1 - b2) * (b1 - a2) >= 0)
        .count()
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Example: {}", solve(&std::fs::read_to_string("../4.txt")?));
    Ok(())
}
