import dns.resolver
import threading

# 目标域名
TARGET_DOMAIN = "baidu.com"  # 改成你自己授权测试的域名
# 子域名字典（可以自己扩充）
sub_dict = [
    "www", "api", "admin", "mail", "blog", "test", "dev",
    "cdn", "static", "app", "m", "bbs", "portal", "ftp"
]

# DNS解析函数
def check_subdomain(sub):
    domain = f"{sub}.{TARGET_DOMAIN}"
    try:
        # DNS查询A记录
        result = dns.resolver.resolve(domain, "A")
        ip_list = [r.address for r in result]
        print(f"✅ 存在：{domain}  -> IP: {ip_list}")
    except dns.resolver.NXDOMAIN:
        # 域名不存在
        pass
    except Exception as e:
        # 解析超时/其他错误直接跳过
        pass

if __name__ == "__main__":
    print(f"开始扫描域名：{TARGET_DOMAIN}")
    threads = []
    for sub in sub_dict:
        t = threading.Thread(target=check_subdomain, args=(sub,))
        threads.append(t)
        t.start()
    # 等待全部线程结束
    for t in threads:
        t.join()
    print("扫描完成！")
