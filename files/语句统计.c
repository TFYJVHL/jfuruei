#include<stdio.h>
main ()
{ char ch;
  int a=0,b=0,c=0;
  while ((ch=getchar ())!='\n')
  {
  	if(ch>='A'&&ch<='Z'||ch>='a'&&ch<='z')
  		a++;
  	else if(ch>='0'&&ch<='9') b++;
  		 else c++;
  }
  printf("×ÖÄ¸:%d\n",a);
  printf("Êý×Ö:%d\n",b);
  printf("×Ö·û:%d\n",c); 
}
