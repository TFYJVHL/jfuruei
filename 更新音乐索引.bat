@echo off
cd /d "%~dp0"
echo ==========================================
echo   Update music index for relax.html
echo ==========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-music-index.ps1"
echo.
echo 索引已更新，回到网页刷新一下就能看到新音乐。
echo.
pause
