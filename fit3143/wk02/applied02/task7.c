#include <stdio.h>

int main() {
    int nc = 0;
    int i = getchar();
    while (i != EOF) {
        nc++;
        i = getchar();
    }

    printf("Number of chars in file: %d", nc);

    return 0;
}

/**
 * Usage
 * 
 * echo "Hello world" | tcc -run task7.c
 * 
 * OR
 * 
 * tcc -run task7.c < foo.txt
 */