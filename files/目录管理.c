#include<stdio.h>
#include<stdlib.h>
main()
{
	int a;
	system("title 目录管理");
	printf("请选一项:\n");
	printf("1查看当前目录\n2返回上一个目录\n3返回根目录\n4查看所有目录\n5进入E盘\n");
	scanf("%d",&a);
	if (a=1)	system("dir");
	else if (a=2)	system("cd..");
	else if (a=3)	system("cd /");
	else if (a=4)	system("dir/s");
	else system("cd /d c:");
	system("cmd"); 
}
