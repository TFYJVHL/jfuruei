import tkinter as tk

root = tk.Tk()
root.withdraw()

def show_multi_color_line(title, text_list):
    win = tk.Toplevel(root)
    win.title(title)
    # 弹窗尺寸
    w = 400
    h = 120
    screen_w = win.winfo_screenwidth()
    screen_h = win.winfo_screenheight()
    x = (screen_w - w)//2
    y = (screen_h - h)//2
    win.geometry(f"{w}x{h}+{x}+{y}")

    # Frame：当做一行的容器，放多个文字
    frame = tk.Frame(win)
    frame.pack(pady=20)

    # 循环创建不同颜色文字，横向排在同一行
    for txt,color in text_list:
        tk.Label(frame, text=txt, fg=color).pack(side="left")

    tk.Button(win, text="确定", command=win.destroy).pack()
    win.grab_set()

# ========== 在这里写同一行的文字和颜色 ==========
# 格式：[(文字1,颜色1), (文字2,颜色2), (文字3,颜色3)]
content = [("hello, ", "red"), ("张三, ", "blue"), ("1", "green")]
show_multi_color_line("输出", content)

root.mainloop()
