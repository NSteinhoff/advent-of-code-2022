max_calories = 0
current = 0

with open('1.txt') as file:
    for line in file:
        current = 0 if line == "\n" else current + int(line)
        max_calories = max(current, max_calories)

print(max_calories)
