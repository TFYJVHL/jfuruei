import tkinter as tk

root = tk.Tk()
root.title("计算器")
# 窗口大小+居中
w = 320
h = 420
screen_w = root.winfo_screenwidth()
screen_h = root.winfo_screenheight()
x = (screen_w - w)//2
y = (screen_h - h)//2
root.geometry(f"{w}x{h}+{x}+{y}")

# 输入框
entry = tk.Entry(root, font=("微软雅黑",20), justify="right")
entry.pack(pady=10, padx=10, fill="x")

# 按下数字/符号
def press(num):
    entry.insert(tk.END, str(num))

# 计算
def calculate():
    try:
        expression = entry.get()
        res = eval(expression)
        entry.delete(0, tk.END)
        entry.insert(0, str(res))
        result_label.config(text=f"结果:{res}", fg="green")
    except ZeroDivisionError:
        result_label.config(text="错误：不能除以0", fg="red")
    except Exception:
        result_label.config(text="表达式错误", fg="red")

# 清空
def clear_all():
    entry.delete(0, tk.END)
    result_label.config(text="", fg="black")

# 结果提示标签（字体变色）
result_label = tk.Label(root, text="", font=("微软雅黑",12))
result_label.pack()

# 按钮容器
frame = tk.Frame(root)
frame.pack()

# 按钮
btn_list = [
    ("7",lambda:press(7)),("8",lambda:press(8)),("9",lambda:press(9)),("/",lambda:press("/")),
    ("4",lambda:press(4)),("5",lambda:press(5)),("6",lambda:press(6)),("*",lambda:press("*")),
    ("1",lambda:press(1)),("2",lambda:press(2)),("3",lambda:press(3)),("-",lambda:press("-")),
    ("0",lambda:press(0)),(".",lambda:press(".")),("=",calculate),("+",lambda:press("+")),
]

row=0
col=0
for text,cmd in btn_list:
    tk.Button(frame,text=text,width=5,height=2,font=("微软雅黑",14),command=cmd).grid(row=row,column=col,padx=3,pady=3)
    col +=1
    if col >=4:
        col=0
        row +=1

tk.Button(root,text="清空",width=10,command=clear_all,font=("微软雅黑",12)).pack(pady=5)

root.mainloop()
