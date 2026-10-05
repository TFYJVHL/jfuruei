from pynput import keyboard

def on_press(key):
    try:
        print(f"按下：{key.char}")
    except AttributeError:
        print(f"特殊按键：{key}")

print("开始监听键盘，按ESC退出")
with keyboard.Listener(on_press=on_press) as l:
    l.join()