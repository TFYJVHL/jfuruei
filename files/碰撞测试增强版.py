import tkinter as tk

root = tk.Tk()
root.title("WASD移动+碰撞检测")

win_w = 500
win_h = 400
# 窗口居中
screen_w = root.winfo_screenwidth()
screen_h = root.winfo_screenheight()
x = (screen_w - win_w)//2
y = (screen_h - win_h)//2
root.geometry(f"{win_w}x{win_h}+{x}+{y}")

canvas = tk.Canvas(root, width=win_w, height=win_h, bg="white")
canvas.pack()

# 蓝色方块
square = canvas.create_rectangle(220, 170, 280, 230, fill="blue")
# 红色小球
ball = canvas.create_oval(350,100,380,130,fill="red")

step = 5
# 记录按键状态
keys = {"w":False, "s":False, "a":False, "d":False}

# 持续循环移动函数
def game_loop():
    pos = canvas.coords(square)
    left, top, right, bottom = pos

    if keys["w"] and top > 0:
        canvas.move(square, 0, -step)
    if keys["s"] and bottom < win_h:
        canvas.move(square, 0, step)
    if keys["a"] and left > 0:
        canvas.move(square, -step, 0)
    if keys["d"] and right < win_w:
        canvas.move(square, step, 0)

    # =========碰撞检测=========
    square_pos = canvas.coords(square)
    ball_pos = canvas.coords(ball)
    # 判断两个矩形重叠
    if overlap(square_pos, ball_pos):
        tk.messagebox.showinfo("碰撞！", "方块碰到小球了！")

    # 重复调用自己，实现循环
    root.after(20, game_loop)

# 判断两个矩形是否重叠
def overlap(rect1, rect2):
    l1,t1,r1,b1 = rect1
    l2,t2,r2,b2 = rect2
    # 不满足下面条件就是重叠
    if r1 < l2 or r2 < l1 or b1 < t2 or b2 < t1:
        return False
    return True

# 按下按键，标记为True
def key_down(event):
    k = event.keysym.lower()
    if k in keys:
        keys[k] = True

# 松开按键，标记为False
def key_up(event):
    k = event.keysym.lower()
    if k in keys:
        keys[k] = False

# 绑定键盘按下、松开事件
root.bind("<KeyPress>", key_down)
root.bind("<KeyRelease>", key_up)

# 启动游戏循环
game_loop()

root.mainloop()
