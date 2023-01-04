#include "prelude.h"

static const char *example = "R 4\n"
			     "U 4\n"
			     "L 3\n"
			     "D 1\n"
			     "R 4\n"
			     "D 1\n"
			     "L 5\n"
			     "R 2\n";

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
	Pos head = {.x = 0, .y = 0};
	Pos tail = {.x = 0, .y = 0};
	Path *path = malloc(sizeof(Path));
	path->pos = tail;
	path->next = NULL;

	LINES(line, input) {
		if (!strcmp(line, "")) continue;
		char direction;
		int amount;
		assert(sscanf(line, "%c %d", &direction, &amount) == 2);
		while (amount--) {
			move(&head, direction);
			follow(&head, &tail);
			push(path, tail);
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
