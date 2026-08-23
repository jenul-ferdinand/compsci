#include <stdio.h>

int main() {
    int AValue, *BValue;

    printf("AValue=%d (useless value because not initialised)\n", AValue);

    AValue = 101;
    printf("Address of &AValue %p AValue = %d \n", &AValue, AValue);

    BValue = &AValue;
    printf("Address of BValue %p *BValue = %d \n", BValue, *BValue);

    AValue = 999;
    printf("*BValue = %d \n", *BValue);

    // BValue is set to the address of AValue, so printing BValue by itself
    // prints the address of AValue. To get the value we dereference it with
    // *BValue, this gives us whatever is in AValue.

    return 0;
}