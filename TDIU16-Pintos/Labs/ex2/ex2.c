#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[])
{
	int tot_len = 0;
	for(int i = 0; i < argc; i++)
	{
//printf("%s", argv[i]);
		printf("%-21s%2d\n", argv[i], (int)strlen(argv[i]));
		tot_len += (int)strlen(argv[i]);
	}
	printf("%-21s%2d\n", "Total length", tot_len);
	printf("Average length %8.2f\n", (float)tot_len/argc);

	return tot_len;
}
