#include "prelude.h"

static char const example[] = "30373\n"
			      "25512\n"
			      "65332\n"
			      "33549\n"
			      "35390\n";

static size_t count_lines(char const *input) {
	// Each line ends in a newline, so we start at 0.
	size_t n = 0;

	for (char c; (c = *input); input++)
		if (c == '\n') n++;

	return n;
}

static int solve(char *input) {
	size_t n = count_lines(input);
	int(*grid)[n] = malloc(sizeof(int[n][n]));
	int(*visibility)[n] = calloc(sizeof(int[n]), n);

	for (size_t i = 0; i < n; i++)
		for (size_t j = 0; j < n; j++)
			grid[i][j] = input[i * n + j + i] - '0';

	for (size_t i = 0; i < n; i++) {
		int left, right, top, bottom;
		left = right = top = bottom = -1;

		for (size_t j = 0; j < n; j++) {
			size_t jj = n - 1 - j;

			if (grid[i][j] > left) {
				visibility[i][j] = 1;
				left = grid[i][j];
			}

			if (grid[i][jj] > right) {
				visibility[i][jj] = 1;
				right = grid[i][jj];
			}

			if (grid[j][i] > top) {
				visibility[j][i] = 1;
				top = grid[j][i];
			}

			if (grid[jj][i] > bottom) {
				visibility[jj][i] = 1;
				bottom = grid[jj][i];
			}
		}
	}

	free(grid);

	int count = 0;
	for (size_t i = 0; i < n; i++)
		for (size_t j = 0; j < n; j++)
			count += visibility[i][j];

	free(visibility);

	return count;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("8.txt"));
}
