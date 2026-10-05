import requests

# 关闭https证书警告
requests.packages.urllib3.disable_warnings()

# 目标网站，改成你的靶站
TARGET_URL = "http://127.0.0.1"
# 敏感路径字典
path_dict = [
    "/",
    "/admin",
    "/admin/login",
    "/phpinfo.php",
    "/robots.txt",
    "/backup",
    "/database",
    "/test",
    "/api",
    "/config.php"
]

def get_web_info(url):
    """获取网站基础信息：状态码、标题、服务器头"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=3, verify=False)
        status_code = resp.status_code
        # 提取网页标题
        title = ""
        if "<title>" in resp.text:
            t1 = resp.text.find("<title>") + len("<title>")
            t2 = resp.text.find("</title>")
            title = resp.text[t1:t2].strip()
        # 获取服务器信息
        server = resp.headers.get("Server", "未知")
        print(f"\n=====【{url}】基础信息 =====")
        print(f"状态码: {status_code}")
        print(f"页面标题: {title}")
        print(f"Server头: {server}")
        return resp
    except requests.exceptions.Timeout:
        print(f"{url} 访问超时")
    except requests.exceptions.ConnectionError:
        print(f"{url} 连接失败")
    except Exception as e:
        print(f"{url} 出错：{str(e)}")

def path_scan(base_url, path_list):
    """敏感路径探测"""
    print("\n===== 开始敏感路径扫描 =====")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    for path in path_list:
        full_url = base_url + path
        try:
            resp = requests.get(full_url, headers=headers, timeout=2, verify=False)
            if resp.status_code in [200, 401, 403]:
                print(f"✅ 发现可访问：{full_url}  状态码:{resp.status_code}")
        except Exception:
            pass

if __name__ == "__main__":
    # 获取网站基础信息
    get_web_info(TARGET_URL)
    # 扫描敏感路径
    path_scan(TARGET_URL, path_dict)
    print("\n探测结束")
