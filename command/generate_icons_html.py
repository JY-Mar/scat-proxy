import json
import os

# 当前脚本所在目录：Icons/command/
current_dir = os.path.dirname(os.path.abspath(__file__))

# 上一级目录：Icons/
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

# 输入 JSON 文件路径
json_path = os.path.join(parent_dir, "images.json")

# 输出 HTML 文件路径
html_path = os.path.join(parent_dir, "icons_index.html")

# 读取 images.json
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# 构建 HTML 内容
html = [
    "<!DOCTYPE html>",
    '<html lang="zh-CN">',
    "<head>",
    '<meta charset="UTF-8">',
    "<title>Icons 图片展示</title>",
    "<style>",
    "body { font-family: sans-serif; background: #f9f9f9; padding: 20px; }",
    "h1 { text-align: center; }",
    "h2 { margin-top: 40px; }",
    ".group { display: flex; flex-wrap: wrap; gap: 10px; }",
    ".group img { max-width: 200px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }",
    "</style>",
    "</head>",
    "<body>",
    "<h1>Icons/Color 图片展示</h1>",
]

for folder, images in data.items():
    html.append(f"<h2>{folder}</h2>")
    html.append('<div class="group">')
    for img_path in images:
        html.append(f'<img src="{img_path}" alt="{img_path}">')
    html.append("</div>")

html.append("</body></html>")

# 写入 HTML 文件到 Icons/ 目录
with open(html_path, "w", encoding="utf-8") as f:
    f.write("\n".join(html))

print(f"✅ icons_index.html 已生成：{html_path}")
