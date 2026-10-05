@echo off
cd /d "%~dp0"
echo ==========================================
echo   Update download index for projects.html
echo ==========================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-files-index.ps1"
echo.
pause
