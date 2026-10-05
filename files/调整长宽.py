import tkinter as tk

root = tk.Tk()
root.withdraw()

def show_color_text(title, msg, w=300, h=120):
    win = tk.Toplevel(root)
    win.title(title)
    # 计算屏幕居中
    screen_w = win.winfo_screenwidth()
    screen_h = win.winfo_screenheight()
    x = (screen_w - w) // 2
    y = (screen_h - h) // 2
    # 设置弹窗宽w，高h
    win.geometry(f"{w}x{h}+{x}+{y}")

    tk.Label(win, text=msg).pack(pady=15)
    tk.Button(win, text="确定", command=win.destroy).pack()
    win.grab_set()

# w=宽度，h=高度
show_color_text("输出", "hello", w=800, h=1120)
show_color_text("输出", "张三", w=300, h=120)
show_color_text("输出", "1", w=300, h=120)
show_color_text("输出", "hello\n张三\n1", w=350, h=180)

root.mainloop()
