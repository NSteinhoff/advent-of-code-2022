io.input('1.txt')

local max = 0

local calories = 0
for line in io.lines() do
    if line == '' then
        max = calories > max and calories or max
        calories = 0
    else
        calories = calories + tonumber(line)
    end
end

print(max)
