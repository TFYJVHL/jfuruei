import time
import random

test_texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Life is what happens when you are busy making other plans.",
    "Python is a simple and powerful programming language."
]

def typing_speed_test():
    print("===== 打字测速器 =====")
    content = random.choice(test_texts)
    print("\n请输入下面这段文字：")
    print(f"\n{content}\n")
    input("准备好，按回车开始！")

    start_time = time.time()
    user_input = input(">>> ")
    end_time = time.time()

    cost = end_time - start_time
    # 计算正确字符
    correct = 0
    for c1, c2 in zip(user_input, content):
        if c1 == c2:
            correct += 1

    total_len = len(content)
    accuracy = correct / total_len * 100
    wpm = len(user_input) / 5 / (cost / 60)

    print(f"\n耗时：{cost:.2f} 秒")
    print(f"正确率：{accuracy:.2f} %")
    print(f"WPM(每分钟单词数)：{wpm:.1f}")

if __name__ == "__main__":
    typing_speed_test()
