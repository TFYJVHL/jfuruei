import tkinter as tk
import random

root = tk.Tk()
root.title("贪吃蛇游戏")

win_w = 500
win_h = 400
screen_w = root.winfo_screenwidth()
screen_h = root.winfo_screenheight()
x = (screen_w - win_w)//2
y = (screen_h - win_h)//2
root.geometry(f"{win_w}x{win_h}+{x}+{y}")

canvas = tk.Canvas(root, width=win_w, height=win_h, bg="black")
canvas.pack()

size = 20
snake = [(100,100)]
dir_x = size
dir_y = 0
food_x = 0
food_y = 0
score = 0
game_over = False

# 生成食物（同时保存坐标，不再依赖canvas对象）
def create_food():
    global food_x, food_y
    while True:
        fx = random.randrange(0, win_w-size, size)
        fy = random.randrange(0, win_h-size, size)
        if (fx, fy) not in snake:
            food_x = fx
            food_y = fy
            break

def change_dir(event):
    global dir_x, dir_y
    if game_over:
        return
    key = event.keysym.lower()
    if key == "w" and dir_y != size:
        dir_x, dir_y = 0, -size
    elif key == "s" and dir_y != -size:
        dir_x, dir_y = 0, size
    elif key == "a" and dir_x != size:
        dir_x, dir_y = -size, 0
    elif key == "d" and dir_x != -size:
        dir_x, dir_y = size, 0

def game_loop():
    global snake, dir_x, dir_y, score, game_over
    if game_over:
        return
    head_x, head_y = snake[0]
    new_head = (head_x + dir_x, head_y + dir_y)

    # 撞墙检测
    if new_head[0]<0 or new_head[0]>=win_w or new_head[1]<0 or new_head[1]>=win_h:
        game_over = True
        tk.messagebox.showinfo("游戏结束",f"撞到墙壁！得分：{score}")
        return
    # 撞到自己
    if new_head in snake:
        game_over = True
        tk.messagebox.showinfo("游戏结束",f"撞到自己！得分：{score}")
        return

    snake.insert(0, new_head)
    # 判断吃到食物
    if new_head[0]==food_x and new_head[1]==food_y:
        score +=10
        create_food() #生成新食物
    else:
        snake.pop()

    # 清空画布，全部重绘
    canvas.delete("all")
    # 画蛇
    for seg_x, seg_y in snake:
        canvas.create_rectangle(seg_x, seg_y, seg_x+size, seg_y+size, fill="green")
    # 画食物
    canvas.create_rectangle(food_x, food_y, food_x+size, food_y+size, fill="red")
    # 分数
    canvas.create_text(40,20,text=f"分数:{score}",fill="white",font=("微软雅黑",12))

    root.after(100, game_loop)

root.bind("<KeyPress>", change_dir)
create_food()
game_loop()
root.mainloop()
