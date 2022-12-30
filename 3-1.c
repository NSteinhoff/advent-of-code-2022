#include "prelude.h"

// priorities go from [1, 52]
#define N 53
#define LEFT 1
#define RIGHT 2

static char const example[] = "vJrwpWtwJgWrhcsFMMfFFhFp\n"
			      "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\n"
			      "PmmdzqPrVvPwwTWBwg\n"
			      "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\n"
			      "ttgJtRGJQctTZtZT\n"
			      "CrZsJsPPZsGzwwsLwLmpwMDw";

static int priority(char c) {
	assert(c <= 'z' && c >= 'A' && "Unexpected character!");
	return c >= 'a' && c <= 'z' ? c - 'a' + 1 : c - 'A' + 27;
}

static int solve(char *input) {
	int items[N] = {0};
	int sum = 0;

	LINES(line, input) {
		size_t n = strlen(line);
		for (size_t i = 0; i < n / 2; i++)
			items[priority(line[i])] |= LEFT;
		for (size_t i = n / 2; i < n; i++)
			items[priority(line[i])] |= RIGHT;

		for (size_t i = 1; i < N; i++) {
			if (items[i] == (LEFT | RIGHT)) sum += i;
			items[i] = 0;
		}
	}

	return sum;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("3.txt"));
	return 0;
}
