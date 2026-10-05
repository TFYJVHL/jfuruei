#include<stdio.h>
main()
{
	int a[10] = {1,2,3};
	printf("%d\n",a[3]);
	printf("%d",3[a]);//数组输出时可以写反 
	
}


#include<stdio.h>
main()
<%
	int a<:3:> =<%2,4,5%>;// a[3]={2,4,5} 可以这样写 
	printf("%d",a<:2:>); 
%>


#include<stdio.h>
main()
{
	int a=10;
	printf("%d",sizeof a);//计算字节 
}

