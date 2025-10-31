import os
import json

# 当前脚本所在目录
base_dir = os.path.dirname(os.path.abspath(__file__))
# 支持的图片扩展名
image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
# 存储结果的字典
grouped_images = {}
# 生成的JSON文件名
gen_file_name = 'images.json'

# 遍历当前目录下的所有子目录
for entry in os.listdir(base_dir):
    subdir_path = os.path.join(base_dir, entry)
    if os.path.isdir(subdir_path):
        image_list = []
        for root, _, files in os.walk(subdir_path):
            for file in files:
                if os.path.splitext(file)[1].lower() in image_extensions:
                    rel_path = os.path.relpath(os.path.join(root, file), base_dir)
                    image_list.append(rel_path.replace("\\", "/"))  # 兼容 Windows 路径
        if image_list:
            grouped_images[entry] = image_list

# 写入 JSON 文件
output_path = os.path.join(base_dir, gen_file_name)
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(grouped_images, f, ensure_ascii=False, indent=2)

print(f'已完成：共分组 {len(grouped_images)} 个子目录，写入 {output_path}')
