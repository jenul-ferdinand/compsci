#include <stdio.h>
#include <string.h>

int my_strlen(char *s);
void my_strcat(char *dest, char *src);
void reverse(char *s);
int count_char(char *s, char c);
int count_char_pointerstyle(char *s, char c);

int main()
{
	// Part 1: string copying the hard way

	char text_1[100], text_2[100];
	char *ta, *tb;
	int i;

	// Array of chars, compiler decides size from the literal
	char message[] = "Hello, I am a string; what are you?";
	printf("Original message: %s\n", message);

	// Copying the message to text_1 the hard way: array indexing
	i = 0;
	while ((text_1[i] = message[i]) != '\0') {
		i++;
	}
	printf("Text_1: %s\n", text_1);

	// Copy using explicit pointer
	ta = message;
	tb = text_2;
	while ((*tb++ = *ta++) != '\0')
		;
	printf("Text_2: %s\n", text_2);

	/*
	The assignment inside the while loop conditions also work as loop tests.

	We do this until we hit "\0", this is the termination character every string
	has.
	*/

	// Part 2: Using string.h

	char line[100], *sub_text;

	// copying string to another (dest, source)
	strcpy(line, "hello, I am a string");
	printf("Line: %s\n", line);

	// string concatenation
	strcat(line, " what are you");
	printf("Line: %s\n", line);

	// string length
	printf("Length of line: %d\n", (int)strlen(line));

	// portion of the string where the first occurrence of W is found
	// expected output: Nothing, there's no characters with uppercase W.
	if ((sub_text = strchr(line, 'W')) != NULL)
		printf("String starting with \"W\" ->%s\n", sub_text);

	// expected output: "what are you".
	if ((sub_text = strchr(line, 'w')) != NULL)
		printf("String starting with \"w\" ->%s\n", sub_text);

	// expected output: "u", just the last character
	if ((sub_text = strchr(line, 'u')) != NULL)
		printf("String starting with \"u\" ->%s\n", sub_text);

	// Part 3: testing

	// my_strlen
	if (strlen("test string") == my_strlen("test string"))
		printf("my_strlen pass\n");

	// my_strcat
	char line_2[100];
	strcpy(line_2, "Hello this is another string");
	printf("Line: %s\n", line_2);
	my_strcat(line_2, " what is this");
	printf("Line: %s\n", line_2);

	// reverse
	char example[] = "hello";
	reverse(example);
	printf("Reversed \"hello\": %s\n", example);

	char example2[] = "hell";
	reverse(example2);
	printf("Reversed \"hell\": %s\n", example2);

	// count_char
	char example3[] = "testting";
	int count = count_char(example3, 't');
	printf("Count of \"t\"s in \"%s\": %d\n", example3, count);
	// count_char_pointerstyle
	int count2 = count_char_pointerstyle(example3, 't');
	printf("Pointer-style count of \"t\"s in \"%s\": %d\n", example3, count2);

    // Part 5, why C let's you 

	return 0;
}

// Part 3: creating my own

int my_strlen(char *s)
{
	int i = 0;
	while (s[i] != '\0')
		i++;
	return i;
}

void my_strcat(char *dest, char *src)
{
	// find the end of dest
	int i = 0;
	while (dest[i] != '\0')
		i++;

	// then do the copy loop to concat
	int k = 0;
	while (src[k] != '\0') {
		dest[i] = src[k];
		++i;
		++k;
	}
	dest[i] = '\0';

	return;
}

void reverse(char *s)
{
	int len = my_strlen(s);
	int k = len - 1;
	int i = 0;
	while (i < k) {
		char temp = s[i];
		s[i] = s[k];
		s[k] = temp;
		i++;
		k--;
	}
	return;
}

int count_char(char *s, char c)
{
	int count = 0;
	int i = 0;
	while (s[i] != '\0') {
		if (s[i] == c)
			count++;
		i++;
	}
	return count;
}

int count_char_pointerstyle(char *s, char c)
{
	int count = 0;
	while (*s != '\0') {
		if (*s == c)
			count++;
		s++;
	}
	return count;
}

