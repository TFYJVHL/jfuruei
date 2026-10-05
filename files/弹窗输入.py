import tkinter as tk
from tkinter import simpledialog, messagebox

root = tk.Tk()
root.withdraw()

# 弹窗输入整数，直接得到int类型
num = simpledialog.askinteger("请输入", "请输入数字：")
messagebox.showinfo("结果", f"{num}")
messagebox.showinfo("结果", f"{num}")
