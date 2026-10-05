@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo 准备打开图片...
:: 核心命令，打开图片
start "" "无标题.png"
echo 图片已在新窗口打开
pause