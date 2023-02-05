#include "math.h"
#include "prelude.h"
#include <stdbool.h>

typedef struct {
	size_t m, n;
} MatDim;

typedef struct {
	size_t row, col;
} Pos;

static const char *example = "Sabqponm\n"
			     "abcryxxl\n"
			     "accszExk\n"
			     "acctuvwj\n"
			     "abdefghi\n";

static MatDim matrix_dimensions(const char *input) {
	MatDim md = {0};
	for (char c; (c = *input++);) {
		if (c == '\n') md.m++;
		if (!md.m) md.n++;
	}
	return md;
}

static size_t idx(Pos pos, MatDim md) {
	return pos.row * md.n + pos.col;
}

static void walk(Pos current, Pos target, int steps, MatDim md, char *map,
		 int *visited) {
	size_t ci = idx(current, md);
	visited[ci] = steps;
	if (current.row == target.row && current.col == target.col) return;

	Pos neighbors[4];
	size_t n = 0;
	if (current.row > 0) {
		neighbors[n] = current;
		neighbors[n++].row--;
	}
	if (current.row < md.m - 1) {
		neighbors[n] = current;
		neighbors[n++].row++;
	}
	if (current.col > 0) {
		neighbors[n] = current;
		neighbors[n++].col--;
	}
	if (current.col < md.n - 1) {
		neighbors[n] = current;
		neighbors[n++].col++;
	}

	for (size_t i = 0; i < n; i++) {
		Pos next = neighbors[i];
		size_t ni = idx(next, md);

		bool reachable = map[ni] - map[ci] <= 1;
		if (!reachable) continue;
		bool shorter = visited[ni] != -1 && visited[ni] <= steps + 1;
		if (shorter) continue;

		walk(next, target, steps + 1, md, map, visited);
	}
}

static int solve(char *input) {
	const MatDim md = matrix_dimensions(input);

	char *map = malloc(sizeof(char[md.m * md.n]));
	int *visited = malloc(sizeof(int[md.m * md.n]));
	Pos *starts = malloc(sizeof(Pos[md.m * md.n]));

	Pos end = {0};
	size_t n_starts = 0;
	for (size_t row = 0; row < md.m; row++) {
		for (size_t col = 0; col < md.n; col++) {
			const size_t i = row * md.n + col;
			const char c = input[row * (md.n + 1) + col];
			map[i] = c == 'S' ? 'a' : c == 'E' ? 'z' : c;
			visited[i] = -1;
			if (c == 'S' || c == 'a') starts[n_starts++] = (Pos){.row = row, .col = col};
			if (c == 'E') end = (Pos){.row = row, .col = col};
		}
	}

	for (size_t i = 0; i < n_starts; i++)
		walk(starts[i], end, 0, md, map, visited);
	int steps = visited[end.row * md.n + end.col];

	free(starts);
	free(map);
	free(visited);

	return steps;
}

int main(void) {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("12.txt"));

	return 0;
}
