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
	int(*score)[n] = malloc(sizeof(int[n][n]));

	for (size_t i = 0; i < n; i++)
		for (size_t j = 0; j < n; j++) {
			grid[i][j] = input[i * n + j + i] - '0';
			score[i][j] = 1;
		}

	for (size_t i = 1; i < n - 1; i++) {
		for (size_t j = 1; j < n - 1; j++) {
			size_t up, down, left, right;
			up = down = left = right = 1;

			for (size_t ii = i - 1;
			     ii > 0 && grid[ii][j] < grid[i][j]; ii--)
				up++;
			score[i][j] *= up;

			for (size_t ii = i + 1;
			     ii < n - 1 && grid[ii][j] < grid[i][j]; ii++)
				down++;
			score[i][j] *= down;

			for (size_t jj = j - 1;
			     jj > 0 && grid[i][jj] < grid[i][j]; jj--)
				left++;
			score[i][j] *= left;

			for (size_t jj = j + 1;
			     jj < n - 1 && grid[i][jj] < grid[i][j]; jj++)
				right++;
			score[i][j] *= right;
		}
	}


	int max = 0;
	for (size_t i = 0; i < n; i++)
		for (size_t j = 0; j < n; j++)
			if (score[i][j] > max) max = score[i][j];

	free(grid);
	free(score);

	return max;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("8.txt"));
}
