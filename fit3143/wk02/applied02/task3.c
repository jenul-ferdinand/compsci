#include <stdio.h>

int main() {

    printf("\n While looping \n");

    int i = 0;
    while (i <= 10) {
        printf("\n%d", i);
        i += 1;
    }

    printf("\n\n For looping \n");

    for (int j = 0; j <= 10; j++) {
        printf("\n%d", j);
    }

    printf("\n\n Infinite loop with breakout \n");

    int k = 0;
    for ( ; ; ) {
        if (k >= 10) {
            break;
        }

        printf("\n%d", k);
        k += 1;
    }

    return 0;
}