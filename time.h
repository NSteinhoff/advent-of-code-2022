#pragma once

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

long get_nanos(void);
long get_nanos(void) {
    struct timespec ts;
    timespec_get(&ts, TIME_UTC);
    return (long)ts.tv_sec * 1000000000L + ts.tv_nsec;
}

