import json
import os

# 当前脚本所在目录：Icons/scripts/
current_dir = os.path.dirname(os.path.abspath(__file__))

# 上一级目录：Icons/
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

# 输入 JSON 文件路径
json_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), "images.json")

# 输出 HTML 文件路径
html_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), "icons.html")

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
    "@media (prefers-color-scheme: light) {",
    "   body { background-color: #f9f9f9; color: #000000; }",
    "   .group .group-item { box-shadow: 0 2px 6px rgba(0,0,0,0.2); }",
    "   .group .group-item:hover { background-color: #ffffff; }",
    "}",
    "@media (prefers-color-scheme: dark) {",
    "   body { background-color: #222222; color: #ffffff; }",
    "   .group .group-item { box-shadow: 0 0 0 1px rgba(88,88,88,0.3); }",
    "   .group .group-item:hover { background-color: #333333; }",
    "}",
    "body { font-family: sans-serif; padding: 20px; }",
    "h1 { text-align: center; }",
    "h2 { margin-top: 40px; }",
    ".group { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }",
    ".group .group-item { width: 144px; height: 144px; padding: 10px; border-radius: 6px; cursor: pointer; will-change: scale, background-color; transition: scale 0.25s ease, background-color 0.25s ease; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: transparent; }",
    ".group .group-item:hover { scale: 1.2; z-index: 2; }",
    ".group .group-item:hover + .group-tip { margin-top: 20px; font-size: 1rem; }",
    ".group .group-item img { object-fit: contain; }",
    ".group .group-tip { width: 100%; text-align: center; font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 5px; will-change: margin-top,font-size; transition: margin-top 0.25s ease, font-size: 0.25s ease; }",
    "</style>",
    "</head>",
    "<body>",
    "<h1>Icons/Color 图片展示</h1>",
]

for folder, images in data.items():
    html.append(f"<h2>{folder}</h2>")
    html.append('<div class="group">')
    for img_path in images:
        img_name = os.path.basename(img_path)
        html.append(f'<div><div class="group-item" title="{img_name}"><img src="{img_path}" alt="{img_path}" /></div><div class="group-tip">{img_name}</div></div>')
    html.append("</div>")

html.append("</body></html>")

# 写入 HTML 文件到 Icons/ 目录
with open(html_path, "w", encoding="utf-8") as f:
    f.write("\n".join(html))

print(f"✅ icons.html 已生成：{html_path}")
