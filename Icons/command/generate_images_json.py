# 当前脚本所在目录：Icons/command/
import json
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

# 上一级目录：Icons/
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))

# 支持的图片扩展名
image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']

# 目标扫描目录：Icons/Color/
color_dir = os.path.join(parent_dir, 'Color')

# 分组结果
grouped_images = {}

# 遍历 Color 子目录
for entry in os.listdir(color_dir):
    subdir_path = os.path.join(color_dir, entry)
    if os.path.isdir(subdir_path):
        image_list = []
        for root, _, files in os.walk(subdir_path):
            for file in files:
                if os.path.splitext(file)[1].lower() in image_extensions:
                    rel_path = os.path.relpath(os.path.join(root, file), parent_dir)
                    image_list.append(rel_path.replace("\\", "/"))
        if image_list:
            grouped_images[entry] = image_list

# 写入 images.json 到 Icons/ 目录
output_path = os.path.join(parent_dir, 'images.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(grouped_images, f, ensure_ascii=False, indent=2)

print(f'✅ 已生成 images.json：{output_path}')
