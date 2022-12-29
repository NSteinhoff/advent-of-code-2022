#include "prelude.h"

static char const example[] = "A Y\n"
			      "B X\n"
			      "C Z\n";

static int const points[3][3] = {
	{
		3 + 1,
		6 + 2,
		0 + 3,
	},
	{
		0 + 1,
		3 + 2,
		6 + 3,
	},
	{
		6 + 1,
		0 + 2,
		3 + 3,
	},
};

static int solve(char *input) {
	char theirs, ours;
	int score = 0;

	LINES(line, input) {
		if (!strcmp(line, "")) break;
		sscanf(line, "%c %c", &theirs, &ours);
		score += points[(int)(theirs - 'A')][(int)(ours - 'X')];
	}

	return score;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("2.txt"));
	return 0;
}
