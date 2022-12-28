#include "prelude.h"

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

static int solve(char *content) {
	int max = 0;
	int calories = 0;

	LINES(line, content) {
		calories = !strcmp(line, "\0") ? 0 : calories + atoi(line);
		max = calories > max ? calories : max;
	}

	return max;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("1.txt"));
	return 0;
}
