from pynput.keyboard import Controller
import time

kb = Controller()
time.sleep(3) # 给你3秒，切换到记事本窗口
text = "Hello，这是Python自动打字！"
for char in text:
    kb.type(char)
    time.sleep(0.1)
