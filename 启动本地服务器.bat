@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 本地服务器 - 关闭此窗口即停止
echo ==========================================
echo   正在启动本地服务器...
echo   启动后会自动打开浏览器，请用
echo   http://localhost:8000  这个地址访问，
echo   这样「下载」按钮才会真正开始下载。
echo ==========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
echo.
echo 服务器已停止。
pause
