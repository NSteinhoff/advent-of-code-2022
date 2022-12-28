#include "prelude.h"

#define MAX_NUMBERS 1000

static const char example[] = "1000\n"
			      "2000\n"
			      "3000\n"
			      "\n"
			      "4000\n"
			      "\n"
			      "5000\n"
			      "6000\n"
			      "\n"
			      "7000\n"
			      "8000\n"
			      "9000\n"
			      "\n"
			      "10000";

static int cmp(const void *left, const void *right) {
	return *(const int *)right - *(const int *)left;
}

static int solve(char *input) {
	int numbers[MAX_NUMBERS];

	size_t i = 0;
	int current = 0;

	LINES(line, input) {
		if (!strcmp(line, "\0")) {
			numbers[i++] = current;
			current = 0;
		} else {
			current += atoi(line);
		}
	}

	qsort(numbers, i, sizeof(int), cmp);

	int total = 0;
	for (int i = 0; i <= 2; i++) total += numbers[i];

	return total;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("1.txt"));
	return 0;
}
