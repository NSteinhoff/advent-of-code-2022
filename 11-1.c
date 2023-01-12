#include "prelude.h"
#include <ctype.h>

#define MAX_MONKEYS 8
#define ROUNDS 20

static const char *example = "Monkey 0:\n"
			     "  Starting items: 79, 98\n"
			     "  Operation: new = old * 19\n"
			     "  Test: divisible by 23\n"
			     "    If true: throw to monkey 2\n"
			     "    If false: throw to monkey 3\n"
			     "\n"
			     "Monkey 1:\n"
			     "  Starting items: 54, 65, 75, 74\n"
			     "  Operation: new = old + 6\n"
			     "  Test: divisible by 19\n"
			     "    If true: throw to monkey 2\n"
			     "    If false: throw to monkey 0\n"
			     "\n"
			     "Monkey 2:\n"
			     "  Starting items: 79, 60, 97\n"
			     "  Operation: new = old * old\n"
			     "  Test: divisible by 13\n"
			     "    If true: throw to monkey 1\n"
			     "    If false: throw to monkey 3\n"
			     "\n"
			     "Monkey 3:\n"
			     "  Starting items: 74\n"
			     "  Operation: new = old + 3\n"
			     "  Test: divisible by 17\n"
			     "    If true: throw to monkey 0\n"
			     "    If false: throw to monkey 1\n";

typedef struct Item Item;

struct Item {
	int value;
	Item *next;
};

typedef struct {
	int n, test, t, f, inspections;
	char op;
	int rhs; // -1 indicates to use lhs (lhs * lhs)
	Item *items;
} Monkey;

static Item *new_item(int value) {
	Item *item = malloc(sizeof(Item));
	item->value = value;
	item->next = NULL;
	return item;
}

static void push(Monkey *monkey, Item *item) {
	if (!monkey->items) {
		monkey->items = item;
		return;
	}

	Item *head = monkey->items;
	while (head->next) head = head->next;
	head->next = item;
}

static Item *pop(Monkey *monkey) {
	if (!monkey->items) return NULL;
	Item *item = monkey->items;
	monkey->items = item->next;
	item->next = NULL;
	return item;
}

static void destroy(Monkey *monkey) {
	for (Item *item; (item = pop(monkey)); free(item)) {}
}

static char *parse_monkey(char *input, Monkey *monkey) {
#define NEXT_LINE                                                              \
	do {                                                                   \
		while (*input++ != '\n' || *input == '\n') {};                 \
		while (*input == ' ') input++;                                 \
	} while (0)

	sscanf(input, "Monkey %d", &monkey->n);
	NEXT_LINE;
	while (*input != '\n') {
		while (!isnumber(*input)) input++;
		push(monkey, new_item((int)strtol(input, &input, 10)));
	}
	NEXT_LINE;
	char rhs[4];
	sscanf(input, "Operation: new = old %c %3s\n", &monkey->op, rhs);
	monkey->rhs = strcmp(rhs, "old") ? atoi(rhs) : -1;
	NEXT_LINE;
	sscanf(input, "Test: divisible by %d\n", &monkey->test);
	NEXT_LINE;
	sscanf(input, "If true: throw to monkey %d\n", &monkey->t);
	NEXT_LINE;
	sscanf(input, "If false: throw to monkey %d\n", &monkey->f);
	NEXT_LINE;

	return input;
#undef NEXT_LINE
}

static int inspect(int value, char op, int rhs) {
	int _rhs = rhs == -1 ? value : rhs;
	switch (op) {
	case '*': return value * _rhs;
	case '+': return value + _rhs;
	default: assert(0);
	}
}

static void round(size_t len, Monkey monkeys[len]) {
	for (size_t i = 0; i < len; i++) {
		Monkey *monkey = &monkeys[i];
		Item *item;
		while ((item = pop(monkey))) {
			monkey->inspections++;
			item->value =
				inspect(item->value, monkey->op, monkey->rhs);
			item->value /= 3;
			int test = item->value % monkey->test == 0;
			Monkey *target = &monkeys[test ? monkey->t : monkey->f];
			push(target, item);
		}
	}
}

static int solve(char *input) {
	size_t n = 0;
	Monkey monkeys[MAX_MONKEYS] = {0};

	while (*input) {
		assert(n < MAX_MONKEYS);
		Monkey *monkey = &monkeys[n++];
		input = parse_monkey(input, monkey);
	}

	int r = ROUNDS;
	while (r--) round(n, monkeys);

	int first = 0;
	int second = 0;
	for (size_t i = 0; i < n; i++) {
		Monkey *monkey = &monkeys[i];
		if (first < monkey->inspections) {
			second = first;
			first = monkey->inspections;
		} else if (second < monkey->inspections) {
			second = monkey->inspections;
		}
		destroy(monkey);
	}

	return first * second;
}

int main(void) {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("11.txt"));

	return 0;
}
