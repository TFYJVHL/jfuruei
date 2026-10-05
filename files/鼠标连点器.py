from pynput import keyboard, mouse
import time
import threading

# ========= 设置参数 =========
click_interval = 0.1   # 点击间隔，单位秒，越小越快 0.1=100ms
is_running = False     # 连点开关
mouse_controller = mouse.Controller()

# 连点循环函数
def click_loop():
    global is_running
    while is_running:
        mouse_controller.click(mouse.Button.left)  # 鼠标左键点击
        time.sleep(click_interval)

# 键盘监听，检测按键
def on_press(key):
    global is_running
    try:
        # F6 开启连点
        if key == keyboard.Key.f6:
            if not is_running:
                is_running = True
                # 开启子线程跑连点，不会卡住键盘监听
                t = threading.Thread(target=click_loop, daemon=True)
                t.start()
                print("✅ 已开启连点(F6)")
        # F7 停止连点
        elif key == keyboard.Key.f7:
            is_running = False
            print("🛑 已停止连点(F7)")
        # ESC 退出程序
        elif key == keyboard.Key.esc:
            is_running = False
            print("👋 程序退出")
            return False  # 返回False，结束键盘监听
    except Exception:
        pass

print("=====鼠标连点器=====")
print("F6：开启连点")
print("F7：停止连点")
print("ESC：退出程序")
print("等待按键...")

# 监听键盘
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()
