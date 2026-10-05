@echo off
setlocal enabledelayedexpansion
title Matrix Code Rain - 黑客帝国代码雨
color 0a
mode con: cols=80 lines=25

:: 初始化随机数生成器
for /l %%i in (1,1,200) do set "rand!random!=1"

:: 初始化每列的位置
set "cols=80"
for /l %%c in (1,1,%cols%) do (
    set /a "pos[%%c]=!random! %% 25"
    set /a "speed[%%c]=!random! %% 3 + 1"
    set /a "cnt[%%c]=0"
)

:: 隐藏光标
echo | set /p="[?25l"

:mainloop
    :: 清屏太慢，我们用home定位光标重绘
    echo | set /p="[H"

    for /l %%r in (1,1,25) do (
        set "line="
        for /l %%c in (1,1,%cols%) do (
            set /a "cnt[%%c]+=1"
            if !cnt[%%c]! geq !speed[%%c]! (
                set /a "cnt[%%c]=0"
                set /a "pos[%%c]+=1"
                if !pos[%%c]! gtr 25 set /a "pos[%%c]=0"
            )
            
            if %%r equ !pos[%%c]! (
                :: 头部白色高亮
                set "line=!line![97m"
                set /a "ch=!random! %% 2"
                if !ch! equ 0 (
                    set "line=!line!0"
                ) else (
                    set "line=!line!1"
                )
            ) else if %%r lss !pos[%%c]! (
                :: 计算距离头部的远近，决定颜色深浅
                set /a "dist=!pos[%%c]! - %%r"
                if !dist! leq 2 (
                    set "line=!line![92m"
                ) else if !dist! leq 5 (
                    set "line=!line![32m"
                ) else (
                    set "line=!line![2;32m"
                )
                :: 随机字符
                set /a "ch=!random! %% 10"
                if "!ch!"=="0" set "line=!line!0"
                if "!ch!"=="1" set "line=!line!1"
                if "!ch!"=="2" set "line=!line!2"
                if "!ch!"=="3" set "line=!line!3"
                if "!ch!"=="4" set "line=!line!4"
                if "!ch!"=="5" set "line=!line!5"
                if "!ch!"=="6" set "line=!line!6"
                if "!ch!"=="7" set "line=!line!7"
                if "!ch!"=="8" set "line=!line!8"
                if "!ch!"=="9" set "line=!line!9"
            ) else (
                set "line=!line! "
            )
        )
        echo !line![0m
    )
    
    :: 控制速度
    for /l %%t in (1,1,500) do rem
    
goto mainloop

:end
:: 恢复光标
echo | set /p="[?25h"
endlocal