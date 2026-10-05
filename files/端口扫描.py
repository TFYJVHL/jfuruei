import socket
import threading

def scan_port(ip, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.3)
    try:
        s.connect((ip, port))
        print(f"【开放】端口 {port}")
    except:
        pass
    s.close()

if __name__ == "__main__":
    target = "127.0.0.1" # 本地回环，只能扫自己
    for p in range(1,100):
        t = threading.Thread(target=scan_port,args=(target,p))
        t.start()
