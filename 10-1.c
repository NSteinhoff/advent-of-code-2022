#include "prelude.h"

#define N 240

static const char *example = "addx 15\n"
			     "addx -11\n"
			     "addx 6\n"
			     "addx -3\n"
			     "addx 5\n"
			     "addx -1\n"
			     "addx -8\n"
			     "addx 13\n"
			     "addx 4\n"
			     "noop\n"
			     "addx -1\n"
			     "addx 5\n"
			     "addx -1\n"
			     "addx 5\n"
			     "addx -1\n"
			     "addx 5\n"
			     "addx -1\n"
			     "addx 5\n"
			     "addx -1\n"
			     "addx -35\n"
			     "addx 1\n"
			     "addx 24\n"
			     "addx -19\n"
			     "addx 1\n"
			     "addx 16\n"
			     "addx -11\n"
			     "noop\n"
			     "noop\n"
			     "addx 21\n"
			     "addx -15\n"
			     "noop\n"
			     "noop\n"
			     "addx -3\n"
			     "addx 9\n"
			     "addx 1\n"
			     "addx -3\n"
			     "addx 8\n"
			     "addx 1\n"
			     "addx 5\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx -36\n"
			     "noop\n"
			     "addx 1\n"
			     "addx 7\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx 2\n"
			     "addx 6\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx 1\n"
			     "noop\n"
			     "noop\n"
			     "addx 7\n"
			     "addx 1\n"
			     "noop\n"
			     "addx -13\n"
			     "addx 13\n"
			     "addx 7\n"
			     "noop\n"
			     "addx 1\n"
			     "addx -33\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx 2\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx 8\n"
			     "noop\n"
			     "addx -1\n"
			     "addx 2\n"
			     "addx 1\n"
			     "noop\n"
			     "addx 17\n"
			     "addx -9\n"
			     "addx 1\n"
			     "addx 1\n"
			     "addx -3\n"
			     "addx 11\n"
			     "noop\n"
			     "noop\n"
			     "addx 1\n"
			     "noop\n"
			     "addx 1\n"
			     "noop\n"
			     "noop\n"
			     "addx -13\n"
			     "addx -19\n"
			     "addx 1\n"
			     "addx 3\n"
			     "addx 26\n"
			     "addx -30\n"
			     "addx 12\n"
			     "addx -1\n"
			     "addx 3\n"
			     "addx 1\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx -9\n"
			     "addx 18\n"
			     "addx 1\n"
			     "addx 2\n"
			     "noop\n"
			     "noop\n"
			     "addx 9\n"
			     "noop\n"
			     "noop\n"
			     "noop\n"
			     "addx -1\n"
			     "addx 2\n"
			     "addx -37\n"
			     "addx 1\n"
			     "addx 3\n"
			     "noop\n"
			     "addx 15\n"
			     "addx -21\n"
			     "addx 22\n"
			     "addx -6\n"
			     "addx 1\n"
			     "noop\n"
			     "addx 2\n"
			     "addx 1\n"
			     "noop\n"
			     "addx -10\n"
			     "noop\n"
			     "noop\n"
			     "addx 20\n"
			     "addx 1\n"
			     "addx 2\n"
			     "addx 2\n"
			     "addx -6\n"
			     "addx -11\n"
			     "noop\n"
			     "noop\n"
			     "noop\n";

typedef struct {
	int begin, end;
} Cycle;

static int solve(char *input) {
	Cycle cycles[N + 1] = {0};

	size_t n = 0;
	cycles[n] = (Cycle){1, 1};

	LINES(line, input) {
		if (!strcmp(line, "")) continue;
		assert(++n <= N);
		int begin = cycles[n - 1].end;
		cycles[n].begin = begin;
		cycles[n].end = begin;
		if (!strcmp(line, "noop")) continue;
		int add;
		assert(sscanf(line, "addx %d", &add) == 1);
		assert(++n <= N);
		cycles[n].begin = begin;
		cycles[n].end = begin + add;
	}

	int sum = 0;
	int a[] = {20, 60, 100, 140, 180, 220};

	for (size_t i = 0; i < sizeof(a) / sizeof(a[0]); i++)
		sum += a[i] * cycles[a[i] - 1].end;

	return sum;
}

int main(void) {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("10.txt"));
	return 0;
}
