import tkinter as tk
from tkinter import simpledialog, messagebox

root = tk.Tk()
root.withdraw()

num = simpledialog.askinteger("ASCII转字符", "输入ASCII数字：")


if num is not None:
    if 0 <= num <= 127:
        char = chr(num)
        messagebox.showinfo("转换结果", f"ASCII码 {num}\n对应的字符是：「{char}」")
    else:
        messagebox.showwarning("提示", "请输入0~127之间的数字！")
