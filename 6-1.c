#include "prelude.h"

#define N 4

static char const example[] = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";

static bool unique(char *a, int len) {
	for (int i = 0; i < len; i++)
		for (int j = i + 1; j < len; j++)
			if (a[i] == a[j]) return false;
	return true;
}

static int solve(char *input) {
	int len = (int)strlen(input);
	for (int i = N - 1; i < len; i++)
		if (unique(&input[i - (N - 1)], N)) return i + 1;

	return 0;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("6.txt"));
	return 0;
}
