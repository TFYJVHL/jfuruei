import os

# 要扫描的盘符，不包含C盘
drives = ["D:\\", "E:\\", "F:\\"]

def delete_empty_folders(root_path):
    # 从底层往上遍历文件夹
    for dirpath, dirnames, filenames in os.walk(root_path, topdown=False):
        try:
            # 判断：文件夹里面没有文件，也没有子文件夹
            if len(os.listdir(dirpath)) == 0:
                print(f"发现空文件夹：{dirpath}")
                os.rmdir(dirpath)  # 把前面#去掉才会真正删除！预览时不要打开
        except PermissionError:
            print(f"权限不足，跳过：{dirpath}")
        except Exception as e:
            print(f"跳过 {dirpath}，错误：{e}")

for drive in drives:
    if os.path.exists(drive):
        print(f"\n====开始扫描 {drive} ====")
        delete_empty_folders(drive)
    else:
        print(f"盘符不存在：{drive}")

print("\n扫描完成！")
