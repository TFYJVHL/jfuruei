#include<stdio.h>
main()
{
	int a,s,d;
	printf("加减乘除计算器\n");
	printf("请输入第一个整数：");
	scanf("%d",&a);
	printf("\n请输入第二个整数：") ;
	scanf("%d",&s);
	printf("请选择运算符\n1.加\t2.减\n3.乘\t4.除\n");
	scanf("%d",&d);
	if(1==d)
		printf("%d+%d=%d",a,s,a+s);
	else if(2==d)
		printf("%d-%d=%d",a,s,a-s);
	else if(3==d)
		printf("%d*%d=%d",a,s,a*s);
	else if(4==d)
		printf("%d/%d=%d",a,s,a/s);
	else
		printf("计算失败"); 
}
