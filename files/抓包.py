from scapy.all import sniff

def packet_callback(packet):
    # 只打印包含IP的包
    if packet.haslayer("IP"):
        src_ip = packet["IP"].src
        dst_ip = packet["IP"].dst
        print(f"源IP:{src_ip}  -> 目标IP:{dst_ip}  协议:{packet['IP'].proto}")

if __name__ == "__main__":
    print("开始抓包，按 Ctrl+C 停止")
    # prn:抓到包执行回调，count=0代表一直抓
    sniff(prn=packet_callback, count=0)
