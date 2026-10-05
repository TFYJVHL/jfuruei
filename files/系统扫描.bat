@ECHO OFF
setlocal EnableDelayedExpansion
title 系统扫描
PUSHD %~DP0 & cd /d "%~dp0"
%1 %2
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :runas","","runas",1)(window.close)&goto :eof
:runas
echo Successfully ran as administrator.
::下方是象输入的代码
echo 开始扫描
pause
sfc \scannow 
pause
pause >nul
exit