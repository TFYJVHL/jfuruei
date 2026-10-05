import random
import tkinter as tk
from tkinter import messagebox

# 颜色配置
BG_GAME = "#bbada0"
BG_EMPTY = "#ccc0b3"
CELL_COLOR = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
}
TEXT_COLOR = {2: "#776e65", 4: "#776e65"}

class Game2048:
    def __init__(self, root):
        self.root = root
        self.root.title("2048弹窗版")
        self.root.resizable(False, False)
        self.board = [[0]*4 for _ in range(4)]
        self.score = 0
        # 画布
        self.frame = tk.Frame(root, bg=BG_GAME, padx=10, pady=10)
        self.frame.pack()
        self.cells = []
        for r in range(4):
            row = []
            for c in range(4):
                l = tk.Label(self.frame, text="", bg=BG_EMPTY, width=4, height=2,
                             font=("Arial", 24, "bold"))
                l.grid(row=r, column=c, padx=6, pady=6)
                row.append(l)
            self.cells.append(row)
        # 加分显示
        self.score_label = tk.Label(root, text=f"分数：{self.score}", font=("Arial",16))
        self.score_label.pack(pady=5)
        # 初始化棋盘
        self.add_random()
        self.add_random()
        self.update_ui()
        # 绑定方向键
        root.bind("<Up>", self.up)
        root.bind("<Down>", self.down)
        root.bind("<Left>", self.left)
        root.bind("<Right>", self.right)

    def add_random(self):
        empty = [(r,c) for r in range(4) for c in range(4) if self.board[r][c]==0]
        if empty:
            r,c = random.choice(empty)
            self.board[r][c] = 2 if random.random()<0.9 else 4

    def move_left(self, row):
        new = [x for x in row if x !=0]
        for i in range(len(new)-1):
            if new[i]==new[i+1]:
                new[i] *=2
                self.score += new[i]
                new.pop(i+1)
        new += [0]*(4-len(new))
        return new

    def transpose(self, b):
        return [list(col) for col in zip(*b)]
    def reverse(self, b):
        return [r[::-1] for r in b]

    def move(self, direction):
        old = [r.copy() for r in self.board]
        if direction == "left":
            for i in range(4):
                self.board[i] = self.move_left(self.board[i])
        elif direction == "right":
            self.board = self.reverse(self.board)
            for i in range(4):
                self.board[i] = self.move_left(self.board[i])
            self.board = self.reverse(self.board)
        elif direction == "up":
            self.board = self.transpose(self.board)
            for i in range(4):
                self.board[i] = self.move_left(self.board[i])
            self.board = self.transpose(self.board)
        elif direction == "down":
            self.board = self.transpose(self.board)
            self.board = self.reverse(self.board)
            for i in range(4):
                self.board[i] = self.move_left(self.board[i])
            self.board = self.reverse(self.board)
            self.board = self.transpose(self.board)
        if old != self.board:
            self.add_random()
            return True
        return False

    def update_ui(self):
        self.score_label.config(text=f"分数：{self.score}")
        for r in range(4):
            for c in range(4):
                val = self.board[r][c]
                if val ==0:
                    self.cells[r][c].config(text="", bg=BG_EMPTY)
                else:
                    self.cells[r][c].config(text=str(val),
                                            bg=CELL_COLOR.get(val,"#3c3a32"),
                                            fg=TEXT_COLOR.get(val,"white"))
        # 判断胜利
        for row in self.board:
            if 2048 in row:
                messagebox.showinfo("胜利！","🎉恭喜你合成2048！")
                self.root.unbind("<Up>")
                self.root.unbind("<Down>")
                self.root.unbind("<Left>")
                self.root.unbind("<Right>")
        # 判断游戏结束
        if not self.can_move():
            messagebox.showerror("游戏结束","💥没有可移动位置！")

    def can_move(self):
        for r in range(4):
            for c in range(4):
                if self.board[r][c]==0:
                    return True
                if r<3 and self.board[r][c]==self.board[r+1][c]:
                    return True
                if c<3 and self.board[r][c]==self.board[r][c+1]:
                    return True
        return False

    def left(self,e):
        if self.move("left"): self.update_ui()
    def right(self,e):
        if self.move("right"): self.update_ui()
    def up(self,e):
        if self.move("up"): self.update_ui()
    def down(self,e):
        if self.move("down"): self.update_ui()

if __name__ == "__main__":
    win = tk.Tk()
    game = Game2048(win)
    win.mainloop()
