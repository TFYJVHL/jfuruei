@echo off
setlocal enabledelayedexpansion
color 0a
mode con cols=70 lines=10
:l
cls
set t=%time:~0,8%
echo Date:!date! Time:!t!
echo.
timeout /t 1 /nobreak>nul
goto l