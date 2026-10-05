import tkinter as tk
from tkinter import messagebox

class TomatoTimer:
    def __init__(self, root):
        self.root = root
        self.root.title("番茄钟 / 倒计时")
        self.time_left = 25 * 60  # 默认25分钟
        self.running = False

        self.label = tk.Label(root, text="25:00", font=("Arial",48))
        self.label.pack(pady=20)

        frame = tk.Frame(root)
        frame.pack()
        tk.Button(frame, text="开始", command=self.start).grid(row=0,column=0,padx=5)
        tk.Button(frame, text="暂停", command=self.pause).grid(row=0,column=1,padx=5)
        tk.Button(frame, text="重置25分钟", command=self.reset_work).grid(row=0,column=2,padx=5)
        tk.Button(frame, text="休息5分钟", command=self.reset_rest).grid(row=0,column=3,padx=5)

    def update_clock(self):
        if self.running and self.time_left > 0:
            self.time_left -= 1
            m = self.time_left // 60
            s = self.time_left % 60
            self.label.config(text=f"{m:02d}:{s:02d}")
            self.root.after(1000, self.update_clock)
        elif self.time_left <= 0:
            self.running = False
            messagebox.showinfo("时间到！","本轮计时结束！")

    def start(self):
        if not self.running:
            self.running = True
            self.update_clock()

    def pause(self):
        self.running = False

    def reset_work(self):
        self.running = False
        self.time_left = 25 * 60
        self.label.config(text="25:00")

    def reset_rest(self):
        self.running = False
        self.time_left = 5 * 60
        self.label.config(text="05:00")

if __name__ == "__main__":
    win = tk.Tk()
    app = TomatoTimer(win)
    win.mainloop()
