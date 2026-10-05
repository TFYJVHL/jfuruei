#include<stdio.h> 
jj(int a[][0],int b)
{
	printf("%d",b[a][b]);
}
main() 
{
	int c[4][4]={{9,2,8,8},{3,4,4,4},{3,2,8,6},{1,1,1,3}};
	jj(c,0); 
}
