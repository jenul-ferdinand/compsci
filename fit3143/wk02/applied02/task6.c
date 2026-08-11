#include <stdio.h>

int main()
{
	char text_1[100], text_2[100], text_3[100];
	char *ta, *tb;
	int i;

	// Array of chars, compiler decides size from the literal
	char message[] = "Hello, I am a string; what are you?";
	printf("Original message: %s\n", message);

	// Copying the message to text_1 the hard way: array indexing
	i = 0;
	while ((text_1[i] = message[i]) != "\0") {
		i++;
	}
	printf("Text_1: %s\n", text_1);

	// Copy using explicit pointer
	ta = message;
	tb = text_2;
	while ((*tb++ = *ta++) != "\0")
		;
	printf("Text_2: %s\n", text_2);

	return 0;
}