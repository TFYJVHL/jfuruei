@echo off
echo 正在调用系统语音
mshta vbscript:CreateObject("SAPI.SpVoice").Speak("你好，我是Windows自带语音，由bat脚本调用")(window.close)
pause