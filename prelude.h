#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdlib.h>

#include "read.h"
#include "time.h"

#define RUN(FUNC, INPUT)                                                       \
	do {                                                                   \
		long start = get_nanos(); \
		WITH(char, input, INPUT) { printf("%d\n", FUNC(input)); }      \
		long end = get_nanos(); \
		printf("Duration: %.2lfms\n", (double)(end - start) / 1000); \
	} while (0)
#define WITH(T, PTR, EXPR) for (T *PTR = (EXPR); PTR; free(PTR), PTR = NULL)
#define LINES(LINE, STRING) for (char *LINE; (LINE = strsep(&STRING, "\n"));)
