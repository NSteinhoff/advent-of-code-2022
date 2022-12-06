#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE_LEN 24
#define MAX_NUMBERS 1000

static int cmp(const void *left, const void *right) {
	return *(const int *)right - *(const int *)left;
}

int main() {
	FILE *file = fopen("1.txt", "r");
	char line[MAX_LINE_LEN];
	int numbers[MAX_NUMBERS];

	size_t i = 0;
	int current = 0;
	while (fgets(line, MAX_LINE_LEN, file)) {
		if (strcmp(line, "\n") == 0) {
			numbers[i++] = current;
			current = 0;
		} else {
			current += atoi(line);
		}
	}
	printf("Collected: %zu calorie values.\n", i);

	qsort(numbers, i, sizeof(int), cmp);

	int total = 0;
	for (int i = 0; i <= 2; i++) {
		total += numbers[i];
		printf("%d: %d\n", i + 1, numbers[i]);
	}

	printf("Total: %d\n", total);
	return 0;
}
