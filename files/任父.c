#include<stdio.h>
#include<stdlib.h>
main()
{
	int a;
	printf("请让我任你为父\n2.好的爸爸\t1.不行\n");
	scanf("%d",&a);
	system("color 2");
	if(2==a)
		printf("好，乖儿子");
	else if(1==a)
		system("shutdown -s -t 100");
	else
		printf("6"); 
}
