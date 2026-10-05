@echo off
for /f "delims=" %%a in ('dir /ad /b /s D:\^|sort /r') do (
rd "%%a">nul 2>nul &&echo ©уд©б╪"%%a"Ёи╧╕и╬ЁЩё║
)
pause