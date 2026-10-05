import tkinter as tk
from tkinter import simpledialog, messagebox

root = tk.Tk()
root.withdraw()
messagebox.showinfo("输出", f"hello")
messagebox.showinfo("输出", f"张三")
messagebox.showinfo("输出", f"1")
messagebox.showinfo("输出", f"hello\n张三\n1")