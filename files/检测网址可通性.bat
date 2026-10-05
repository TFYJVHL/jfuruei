@echo off
echo 正在测试中
:qqq
ping www.baidu.com>nul
if not %errorlevel% EQU 0 goto again
start "正常" echo 正常