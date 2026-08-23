#include <stdio.h>

int main()
{
	FILE *fp;
	int i;

	fp = fopen("foo.dat", "w");

	fprintf(fp, "\nSample Code\n\n");
	for (i = 1; i <= 10; i++)
		fprintf(fp, "i = %d\n", i);

	fclose(fp);
	return 0;
}

// Run with tcc -run task9.c && cat foo.dat