import tkinter as tk

root = tk.Tk()
root.title("WASD移动方块")

# 窗口大小
win_w = 500
win_h = 400
# 窗口居中
screen_w = root.winfo_screenwidth()
screen_h = root.winfo_screenheight()
x = (screen_w - win_w)//2
y = (screen_h - win_h)//2
root.geometry(f"{win_w}x{win_h}+{x}+{y}")

# 创建画布
canvas = tk.Canvas(root, width=win_w, height=win_h, bg="white")
canvas.pack()

# 方块初始坐标
x1, y1 = 220, 170
x2, y2 = 280, 230
# 绘制方块
square = canvas.create_rectangle(x1, y1, x2, y2, fill="blue")

step = 10  # 每次移动距离

def move(event):
    global x1,y1,x2,y2
    key = event.keysym
    if key == "w":
        canvas.move(square, 0, -step)
    elif key == "s":
        canvas.move(square, 0, step)
    elif key == "a":
        canvas.move(square, -step, 0)
    elif key == "d":
        canvas.move(square, step, 0)

# 绑定键盘事件
root.bind("<Key>", move)

root.mainloop()
