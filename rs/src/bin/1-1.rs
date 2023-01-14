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
    let (max, _) = data
        .lines()
        .filter_map(|line| match line {
            "" => Some(-1),
            _ => line.parse::<i32>().ok(),
        })
        .fold((0, 0), |(mut max, mut elf), calories| match calories {
            -1 => (max, 0),
            _ => {
                elf += calories;
                max = if elf > max { elf } else { max };

                (max, elf)
            }
        });

    max
}

fn main() -> std::io::Result<()> {
    println!("Example: {}", solve(EXAMPLE));
    println!("Problem: {}", solve(&std::fs::read_to_string("../1.txt")?));
    Ok(())
}
