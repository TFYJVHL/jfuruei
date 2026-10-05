import tkinter as tk
from tkinter import simpledialog

root = tk.Tk()
root.withdraw()

def show_color_text(title, msg, font_color, w, h):
    win = tk.Toplevel(root)
    win.title(title)
    # 屏幕居中计算
    screen_w = win.winfo_screenwidth()
    screen_h = win.winfo_screenheight()
    x = (screen_w - w) // 2
    y = (screen_h - h) // 2
    win.geometry(f"{w}x{h}+{x}+{y}")

    tk.Label(win, text=msg, fg=font_color).pack(pady=15)

    win.grab_set()

# 用户输入宽度
width = simpledialog.askinteger("设置弹窗宽度","请输入弹窗宽度（数字）")
# 用户输入高度
height = simpledialog.askinteger("设置弹窗高度","请输入弹窗高度（数字）")

if width is not None and height is not None:
    # 弹出自定义大小弹窗
    show_color_text("输出", "hello\n张三\n1", "red", width, height)

root.mainloop()
