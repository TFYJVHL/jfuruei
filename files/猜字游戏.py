import random

def guess_game():
    print("===== 猜数字游戏 =====")
    secret = random.randint(1, 100)
    count = 0
    while True:
        try:
            num = int(input("请输入1~100数字："))
            count += 1
            if num > secret:
                print("太大了！往小猜")
            elif num < secret:
                print("太小了！往大猜")
            else:
                print(f"🎉恭喜！猜对啦！答案是{secret}，一共猜了{count}次")
                break
        except ValueError:
            print("❌请输入整数！")

if __name__ == "__main__":
    guess_game()
