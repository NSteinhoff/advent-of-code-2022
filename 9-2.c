#include "prelude.h"

#define N 10

static const char *example = "R 5\n"
			     "U 8\n"
			     "L 8\n"
			     "D 3\n"
			     "R 17\n"
			     "D 10\n"
			     "L 25\n"
			     "U 20\n";

typedef struct {
	int x, y;
} Pos;

typedef struct Path Path;
struct Path {
	Pos pos;
	Path *next;
};

static void follow(const Pos *head, Pos *tail) {
	int dx = head->x - tail->x;
	int dy = head->y - tail->y;

	if (abs(dx) > 1 || abs(dy) > 1) {
		if (dx > 0) tail->x++;
		if (dx < 0) tail->x--;
		if (dy > 0) tail->y++;
		if (dy < 0) tail->y--;
	}
}

static void move(Pos *head, char direction) {
	switch (direction) {
	case 'U': head->y--; break;
	case 'D': head->y++; break;
	case 'L': head->x--; break;
	case 'R': head->x++; break;
	}
}

static void destroy(Path *path) {
	if (!path) return;
	destroy(path->next);
	free(path);
}

static void push(Path *path, Pos pos) {
	assert(path);
	if (path->pos.x == pos.x && path->pos.y == pos.y) return;
	while (path->next) {
		path = path->next;
		if (path->pos.x == pos.x && path->pos.y == pos.y) return;
	}
	path->next = malloc(sizeof(Path));
	path->next->pos = pos;
}

static int len(const Path *path) {
	assert(path);
	int n = 1;

	while ((path = path->next))
		n++;

	return n;
}

static int solve(char *input) {
	Pos rope[N] = {0};
	Path *path = malloc(sizeof(Path));
	path->pos = (Pos){.x = 0, .y = 0};
	path->next = NULL;

	LINES(line, input) {
		if (!strcmp(line, "")) continue;
		char direction;
		int amount;
		assert(sscanf(line, "%c %d", &direction, &amount) == 2);
		while (amount--) {
			Pos *head = &rope[0];
			move(head, direction);
			for (int i = 0; i < N - 1; i++)
				follow(&rope[i], &rope[i + 1]);
			push(path, rope[N - 1]);
		}
	}

	int count = len(path);

	destroy(path);

	return count;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("9.txt"));
}
