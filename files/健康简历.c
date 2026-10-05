#include<stdio.h>
main()
{
	int a,b;
    float c;
	printf("你的体重是:");
	scanf("%d",&a);
	printf("你的身高是:");
	scanf("%f",&c);
	printf("你的年龄是:");
	scanf("%d",&b);
	printf("纪福瑞\t个人简历\n体重:%d\t身高:%.2f\t年龄:%d\n",a,c,b);
	if(a<80) printf("体重方面:营养不良");
	else printf("体重方面:健康") ;
}



