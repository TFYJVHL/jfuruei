from scapy.all import rdpcap
import os

def analysis_pcap(pcap_file):
    if not os.path.exists(pcap_file):
        print(f"错误：文件 {pcap_file} 不存在！")
        return
    packets = rdpcap(pcap_file)
    print(f"总共读取 {len(packets)} 个数据包\n")
    for pkt in packets:
        if pkt.haslayer("IP"):
            sip = pkt["IP"].src
            dip = pkt["IP"].dst
            print(f"{sip}  ==>  {dip}")

if __name__ == "__main__":
    # 修改为你的pcap文件路径
    pcap_path = r"C:\Users\Administrator\Desktop\test.pcap"
    analysis_pcap(pcap_path)
