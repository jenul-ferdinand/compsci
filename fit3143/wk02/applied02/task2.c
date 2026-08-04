#include <stdio.h>
#include <math.h>

int main() {
    int ad;
    double ar, pi, val;

    printf("\nCompute the table of the sine function\n");
    pi = 4.0 * atan(1.0);
    printf(" Value of PI: %f \n\n", pi);
    printf(" angle Sine \n");
    ad = 0;
    while (ad <= 360) {
        ar = pi * ad / 180.0;
        val = sin(ar);
        printf(" %3d  %f \n ", ad, val);
        ad = ad + 10;
    }

    return 0;
}