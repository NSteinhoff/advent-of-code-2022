#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE 24

int main() {
	FILE *file = fopen("1.txt", "r");
	char line[MAX_LINE];

	int max = 0;
	int calories = 0;
	while (fgets(line, MAX_LINE, file)) {
		calories = strcmp(line, "\n") == 0 ? 0 : calories + atoi(line);
		max = calories > max ? calories : max;
	}

	printf("%d\n", max);
	return 0;
}
