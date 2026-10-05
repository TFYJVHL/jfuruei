@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo.
color 3
set "L1=   ##      ##   "
set "L2=  ####    ####  "
set "L3= ######  ###### "
set "L4= ############## "
set "L5=  ############  "
set "L6=   ##########   "
set "L7=    ########    "
set "L8=     ######     "
set "L9=      ####      "
set "L10=      ##       "
for %%x in (L1 L2 L3 L4 L5 L6 L7 L8 L9 L10) do (
    call echo !%%x!
    ping -n 1 127.0.0.1 -w 250 >nul
)
pause