from pynput import mouse

def on_move(x,y):
    print(f"鼠标位置：X={x}, Y={y}")

with mouse.Listener(on_move=on_move) as l:
    l.join()
