#include<stdio.h>
main()
{
	int n,i;
	printf("输入一个整数:"); scanf("%d",&n); 
	while(n>0)
	{
		printf("%d",n%10);
		n/=10;
	}
}
