#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#include "read.h"
#include "time.h"

#define i32 int32_t
#define i64 int64_t
#define u32 uint32_t
#define u64 uint64_t

#define RUN(FUNC, INPUT)                                                       \
	do {                                                                   \
		long start = get_nanos();                                      \
		WITH(char, input, INPUT) { printf("%d\n", FUNC(input)); }      \
		long end = get_nanos();                                        \
		printf("Duration: %.2lfms\n", (double)(end - start) / 1000);   \
	} while (0)
#define RUNS(FUNC, INPUT, N)                                                   \
	do {                                                                   \
		char output[N + 1] = {0};                                      \
		long start = get_nanos();                                      \
		WITH(char, input, INPUT) {                                     \
			FUNC(input, output);                                   \
			printf("%s\n", output);                                \
		}                                                              \
		long end = get_nanos();                                        \
		printf("Duration: %.2lfms\n", (double)(end - start) / 1000);   \
	} while (0)
#define RUNL(FUNC, INPUT)                                                       \
	do {                                                                   \
		long start = get_nanos();                                      \
		WITH(char, input, INPUT) { printf("%llu\n", FUNC(input)); }      \
		long end = get_nanos();                                        \
		printf("Duration: %.2lfms\n", (double)(end - start) / 1000);   \
	} while (0)
#define WITH(T, PTR, EXPR) for (T *PTR = (EXPR); PTR; free(PTR), PTR = NULL)
#define LINES(LINE, STRING) for (char *LINE; (LINE = strsep(&STRING, "\n"));)
