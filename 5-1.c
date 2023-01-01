#include "prelude.h"

#define N 9

static char const example[] = "    [D]\n"
			      "[N] [C]\n"
			      "[Z] [M] [P]\n"
			      " 1   2   3\n"
			      "\n"
			      "move 1 from 2 to 1\n"
			      "move 3 from 1 to 3\n"
			      "move 2 from 2 to 1\n"
			      "move 1 from 1 to 2";

typedef struct {
	char *elements;
	size_t head;
	size_t capacity;
} Stack;

static size_t push(Stack *stack, char element) {
	if (stack->head >= stack->capacity) {
		stack->capacity = stack->capacity ? stack->capacity * 2 : 2;
		stack->elements =
			realloc(stack->elements, sizeof(char[stack->capacity]));
		return push(stack, element);
	}

	stack->elements[stack->head++] = element;
	return stack->head - 1;
}

static char pop(Stack *stack) {
	assert(stack->head && "Trying to pop empty stack");
	return stack->elements[--stack->head];
}

static char peek(Stack *stack) {
	if (!stack->head) return ' ';
	return stack->elements[stack->head - 1];
}

static void transfer(Stack *from, Stack *to) {
	while (from->head)
		push(to, pop(from));
}

static void move(int n, Stack *from, Stack *to) {
	while (n--)
		push(to, pop(from));
}

static void reverse(Stack *stack) {
	Stack hold1 = {0};
	Stack hold2 = {0};
	transfer(stack, &hold1);
	transfer(&hold1, &hold2);
	transfer(&hold2, stack);
}

static int solve(char *input, char *out) {
	Stack stacks[N] = {0};

	LINES(line, input) {
		if (!strcmp(line, "")) break;
		if (line[1] == '1') continue;
		for (size_t i = 0; i < N; i++) {
			size_t ii = i * 4 + 1;
			if (strlen(line) <= ii) break;
			if (line[ii] == ' ') continue;
			push(&stacks[i], line[ii]);
		}
	}

	for (int i = 0; i < N; i++)
		reverse(&stacks[i]);

	LINES(line, input) {
		if (!strcmp(line, "")) break;
		int n, from, to;
		assert(sscanf(line, "move %d from %d to %d\n", &n, &from,
			      &to) == 3);
		move(n, &stacks[from - 1], &stacks[to - 1]);
	}

	for (int i = 0; i < N; i++)
		out[i] = peek(&stacks[i]);

	for (int i = 0; i < N; i++)
		free(stacks[i].elements);

	return 0;
}

int main() {
	RUNS(solve, strdup(example), N);
	RUNS(solve, read_to_string("5.txt"), N);
	return 0;
}
