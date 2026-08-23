#include <stdio.h>
#include <stdlib.h>

int main(int argc, char** argv) {
    int a_value = 0;
    float b_value = 0.0;
    char* c_value = NULL;
    int d1_value = 0, d2_value = 0;

    int i;

    printf("argc = %d\n", argc);

    // for (i = 0; i < argc; i++) 
    //     printf("argv[%d] = \"%s\"\n", i, argv[i]);

    for (i = 1; i < argc; i++) {
        if (argv[i][0] == '-') {
            switch (argv[i][1]) {
                case 'a': a_value = atoi(argv[++i]);
                    break;
                case 'b': b_value = atof(argv[++i]);
                    break;
                case 'c': c_value = argv[++i];
                    break;
                case 'd': d1_value = atoi(argv[++i]);
                          d2_value = atoi(argv[++i]);
                          break;
            }
        }
    }

    printf("a = %d\n", a_value);
    printf("b = %f\n", b_value);
    if (c_value != NULL) printf("c = \"%s\"\n", c_value);
    printf("d1 = %d, d2 = %d\n", d1_value, d2_value);
    return 0;
}

// Example to run with: tcc -run task12.c -i 2 -g -x 3 4