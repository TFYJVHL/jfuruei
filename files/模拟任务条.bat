@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo 正在执行模拟任务，请稍候...
powershell "$p=0;while($p -le 100){$bar='#'*($p/5)+' '*(20-$p/5);Write-Host -NoNewline "`r[$bar] $p%%";Start-Sleep -Milliseconds 300;$p=$p+5};Write-Host ''"
echo.
echo 任务执行完成！
pause