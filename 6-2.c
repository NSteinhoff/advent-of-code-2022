#include "prelude.h"

#define N 14

static char const example[] = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";

static bool unique(char *a, int len) {
	int counts[256] = {0};

	for (int i = 0; i < len; i++) {
		unsigned char c = (unsigned char)a[i];
		if (counts[c]) return false;
		counts[c]++;
	}

	return true;
}

static int solve(char *input) {
	int len = (int)strlen(input);
	for (int i = N; i < len; i++)
		if (unique(&input[i - N], N)) return i;

	return 0;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("6.txt"));
	return 0;
}
