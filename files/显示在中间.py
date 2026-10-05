import tkinter as tk

root = tk.Tk()
root.withdraw()

def show_color_text(title, msg, font_color):
    win = tk.Toplevel(root)
    win.title(title)
    w = 300
    h = 120
    # 获取屏幕宽高，计算居中坐标
    screen_w = win.winfo_screenwidth()
    screen_h = win.winfo_screenheight()
    x = (screen_w - w) // 2
    y = (screen_h - h) // 2
    # 设置窗口大小+居中位置
    win.geometry(f"{w}x{h}+{x}+{y}")

    # 一行文字，fg字体颜色
    tk.Label(win, text=msg, fg=font_color).pack(pady=15)
    tk.Button(win, text="确定", command=win.destroy).pack()
    win.grab_set()

show_color_text("输出", "hello", "red")
show_color_text("输出", "张三", "blue")
show_color_text("输出", "1", "green")

root.mainloop()
