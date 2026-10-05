import tkinter as tk

root = tk.Tk()
root.withdraw()

def show_color_text(title, msg, font_color):
    win = tk.Toplevel(root)
    win.title(title)
    # 一行文字，fg设置字体颜色
    tk.Label(win, text=msg, fg=font_color).pack(pady=15)
    tk.Button(win, text="确定", command=win.destroy).pack()
    win.grab_set()

# 弹窗输出变色文字
show_color_text("输出", "红色", "red")


show_color_text("输出", "绿色", "green")
show_color_text("输出", "红色", "red")
show_color_text("输出", "黑色", "black")
show_color_text("输出", "白色", "white")
show_color_text("输出", "灰色", "grey")
# 【必不可少！！】消息循环，保持窗口显示
root.mainloop()
