#include<stdio.h>
#include<stdlib.h>
main()
{
	printf("正在关闭休眠");
	system("powercfg -h off");
	printf("\n以关闭休眠\n");
	system("pause");
}
