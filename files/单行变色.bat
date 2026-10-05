@echo off
setlocal enabledelayedexpansion
:: 生成ESC转义字符
for /f %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"

:: 单行绿色文字
echo !ESC![32m这一行文字是绿色!ESC![0m
:: 单行红色文字
echo !ESC![31m这一行文字是红色!ESC![0m
:: 单行黄色
echo !ESC![33m这一行文字是黄色!ESC![0m

::同一行内多种颜色
echo !ESC![31m红!ESC![32m绿!ESC![34m蓝!ESC![0m 恢复默认颜色

pause