import tkinter as tk
from tkinter import filedialog, messagebox
import pygame

# 初始化音频模块
pygame.mixer.init()

root = tk.Tk()
root.title("简易音乐播放器")
# 窗口居中
w = 400
h = 220
screen_w = root.winfo_screenwidth()
screen_h = root.winfo_screenheight()
x = (screen_w - w) // 2
y = (screen_h - h) // 2
root.geometry(f"{w}x{h}+{x}+{y}")

music_path = ""
is_playing = False

# 选择音乐文件
def open_music():
    global music_path
    file = filedialog.askopenfilename(
        title="选择音频",
        filetypes=[("音频文件", "*.mp3 *.wav")]
    )
    if file:
        music_path = file
        # 文件名蓝色字体
        label_name.config(text=file.split("/")[-1], fg="blue")

# 播放
def play_music():
    global is_playing
    if not music_path:
        messagebox.showwarning("提示", "请先选择音乐！")
        return
    pygame.mixer.music.load(music_path)
    pygame.mixer.music.play()
    is_playing = True
    label_status.config(text="正在播放", fg="green")

# 暂停
def pause_music():
    global is_playing
    if is_playing:
        pygame.mixer.music.pause()
        is_playing = False
        label_status.config(text="已暂停", fg="orange")

# 停止
def stop_music():
    pygame.mixer.music.stop()
    label_status.config(text="已停止", fg="red")

# 音量滑块
def set_volume(val):
    volume = float(val)/100
    pygame.mixer.music.set_volume(volume)

# 界面
label_name = tk.Label(root, text="未选择音乐", font=("微软雅黑",12))
label_name.pack(pady=10)

label_status = tk.Label(root, text="等待播放", font=("微软雅黑",12))
label_status.pack()

frame_btn = tk.Frame(root)
frame_btn.pack(pady=10)

tk.Button(frame_btn, text="选择音乐", command=open_music).grid(row=0,column=0,padx=4)
tk.Button(frame_btn, text="播放", command=play_music).grid(row=0,column=1,padx=4)
tk.Button(frame_btn, text="暂停", command=pause_music).grid(row=0,column=2,padx=4)
tk.Button(frame_btn, text="停止", command=stop_music).grid(row=0,column=3,padx=4)

# 音量条
slider = tk.Scale(root, from_=0, to=100, orient="horizontal", label="音量", command=set_volume)
slider.set(70)
slider.pack(pady=5)

root.mainloop()
