#include "prelude.h"

// priorities go from [1, 52]
#define N 53

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

	int n = 0;
	LINES(line, input) {
		int elf = 1 << n++ % 3;
		for (int i = 0; line[i]; i++)
			items[priority(line[i])] |= elf;

		if (n > 0 && n % 3 == 0) {
			for (int i = 1; i < N; i++) {
				if (items[i] == (1 | 2 | 4)) sum += i;
				items[i] = 0;
			}
		}
	}

	return sum;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("3.txt"));
	return 0;
}
