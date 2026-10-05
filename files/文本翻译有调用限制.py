import requests

def translate_text(text, from_lang="en", to_lang="zh"):
    url = "https://api.funtranslations.com/translate/minion.json"
    # 简易免费公共翻译接口，仅用于学习，有调用次数限制
    params = {"text": text}
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        result = data["contents"]["translated"]
        return result
    except Exception as e:
        return f"翻译失败：{str(e)}"

# 简易中英互译版本（备用，上面接口容易限流）
def simple_translate_demo():
    print("====文本翻译工具====")
    while True:
        print("\n1:翻译成小黄人语(funtranslations)，输入q退出")
        txt = input("输入待翻译文本：")
        if txt.lower() == "q":
            break
        res = translate_text(txt)
        print("翻译结果：", res)

if __name__ == "__main__":
    simple_translate_demo()
