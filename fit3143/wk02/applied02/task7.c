#include <stdio.h>

void char_counter() {
    int nc = 0;
    int i = getchar();
    while (i != EOF) {
        nc++;
        i = getchar();
    }

    printf("Number of chars in file: %d", nc);
}

void line_counter() {
    int c, nl = 0;
    while ((c = getchar()) != EOF) {
        if (c == '\n') nl++;
    }

    printf("Number of lines in file: %d", nl);
}

int main() {
    // char_counter();
    line_counter();

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