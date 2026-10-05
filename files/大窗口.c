#include<windows.h>
#define DE
struct HINSTANCE_
{
	int unused;
};
typedef struct HINSTANCE__ * HINSTANCE;
int WINAPI winMain(HINSTANCE hInstance,HINSTANCE  hPreinstance,LPSTR lpcmdline,int nCmdShow)
{

	int a=0,b=1,c=2;
	char str[10];
	sprintf(str,"%d,%d",c=a+b,a=a+b);
	Wchae_t szAppClassMame[]=L"DKGuuiFoundation";
	WDCLASS wc;
	wc.style	=CS_HREDRAW | CS_VREDRAW; 
	WC.lpfnWndProc =WindowProc; 
	wC.cbClsExtra 0;
	wC.cbWndExtra =0; 
	wC.hInstance =hInstance; 
	WC.hIcon =LoadIcon (NULL, IDI_APPLICATION); 
	wc.hCursor =LoadCursor(NULL,IDC_ARROW);
	wc.hbrBackground=CreateSolidBrush(RGB(255,0,0));
	wc.lpszMenuName=MULL;
	wC.lpszClassName =szAPPClassName;
	if (FALSE==RegisterClass(&wc))
	{
		MessageBox(MULL,L"ii",L"ll",MB_OK);
	}
	CreateWindow(
		szAppClassName,
		L"hh",
		WS_BORDER|WS_CAPTION|WS_SYSMENU|WS_MAXIMIZEBOX|WS_MINIMIZEBOX,
		200;
		200;
		800;
		600;
		MULL;
		MULL;
		hinstance,
		)
	
	
} 
