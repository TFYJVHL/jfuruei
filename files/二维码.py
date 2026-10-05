import qrcode
img = qrcode.make("https://www.baidu.com")
img.save("myqrcode.png")
