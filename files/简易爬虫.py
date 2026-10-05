import requests

# 请求网页
res = requests.get("https://www.baidu.com")
# 设置编码
res.encoding = "utf-8"
# 打印网页源码
print(res.text)
