#include<stdio.h>
#include<stdlib.h> 
main() 
{
	int a=0,c;
	printf("猜数\n你有五次机会这个数在0~100以内");
	int b=rand()%100;
	for (a=0; a<=5; a++)
	{ 
		printf("\n第%d次\t请输入一个数:",a);
		scanf("%d",&c);
	 if (b==c)
	 {
	 	printf("\n对了");
	 	break;
	 }
	 else if (b>c) printf("\n小了"); 
	 else printf("\n大了"); 
	} 
}
