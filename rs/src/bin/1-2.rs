const EXAMPLE: &str = r"1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
1000";

fn solve(data: &str) -> i32 {
    let mut elves = data
        .lines()
        .filter_map(|line| match line {
            "" => Some(-1),
            _ => line.parse::<i32>().ok(),
        })
        .fold(Vec::new(), |mut elves, calories| match calories {
            -1 => {
                elves.push(0);
                elves
            }
            _ => {
                let mut elf = elves.pop().unwrap_or(0);
                elf += calories;
                elves.push(elf);
                elves
            }
        });

    elves.sort();
    elves.reverse();
    elves.iter().take(3).sum()
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    let data = std::fs::read_to_string("../1.txt")?;
    println!("Problem: {}", solve(&data));
    Ok(())
}
