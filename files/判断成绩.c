#include<stdio.h>
main()
{
	float a;
	printf("输入你的一科成绩:");
	scanf("%f",&a);
	if(a<60) printf("\n不及格! ~_~");
	else if(a>100) printf("\n你在玩我吗? *-*？");
	     else printf("\n良好继续努力! ^_^");
}
