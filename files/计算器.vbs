msgbox"你好欢迎使用老黑做的计算器",,"福瑞制作顶呱呱"
dim a,b,c,m
a=CDBL(inputbox("请你输入第一个数字"))
c=inputbox("请你输入运算符号")
b=CDBL(inputbox("请你输入第二个数字"))
if c="+" then m=a+b
if c="-" then m=a-b
if c="*" then m=a*b
if c="/" then m=a/b
if a="" then
msgbox"你个大聪明缺少参数1",,"Error"
elseif b="" then
msgbox"你个大聪明缺少参数2",,"Error"
elseif c="" then
msgbox"我滴妈缺少运算符号",,"Error"
else
msgbox a&c&b&"="&m,,"我也是给你算完了好吧"
end if