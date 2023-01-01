#include "prelude.h"

static char const example[] = "2-4,6-8\n"
			      "2-3,4-5\n"
			      "5-7,7-9\n"
			      "2-8,3-7\n"
			      "6-6,4-6\n"
			      "2-6,4-8";

static int solve(char *input) {
	int count = 0;
	LINES(line, input) {
		if (!strcmp(line, "")) break;
		int a1, a2, b1, b2;
		assert(sscanf(line, "%d-%d,%d-%d", &a1, &a2, &b1, &b2) == 4);
		if ((a1 - b2) * (b1 - a2) >= 0) count++;
	}

	return count;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("4.txt"));
	return 0;
}
