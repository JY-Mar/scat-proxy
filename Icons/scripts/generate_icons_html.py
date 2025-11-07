import json
import os
import re


# 当前脚本所在目录：Icons/scripts/
current_dir = os.path.dirname(os.path.abspath(__file__))

# 上一级目录：Icons/
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

# 输入 JSON 文件路径
json_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), "images.json")

# 输出 HTML 文件路径
html_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), "index.html")


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
    "<link rel=\"stylesheet\" href=\"viewer.min.css\" />",
    "<link rel=\"stylesheet\" href=\"style.css\" />",
    "</head>",
    "<body>",
    "<script src=\"viewer.min.js\"></script>"
    "<h1>Icons/Color 图片展示</h1>",
    '<div style="text-align:right; margin-bottom:20px;">',
    "    <label>图标大小：</label>",
    "    <button onclick=\"setSize('large')\">大</button>",
    "    <button onclick=\"setSize('medium')\">中</button>",
    "    <button onclick=\"setSize('small')\">小</button>",
    "</div>",
]

for folder, images in data.items():
    html.append(f"<h2>{folder}</h2>")
    html.append('<div class="group">')
    for img_path in images:
        img_name = os.path.basename(img_path)
        html.extend(
            [
                '<div class="icon-wrapper">',
                f'    <div class="icon-item medium" title="{img_name}">',
                '        <div class="img-wrapper">'
                f'            <img src="{img_path}" alt="{img_path}" />',
                "        </div>",
                "    </div>",
                f'    <div class="icon-tip">{img_name}</div>',
                "</div>",
            ]
        )
    html.append("</div>")

# 添加 JavaScript
html.extend(
    [
        "<script>",
        "function setSize(size) {",
        "    document.querySelectorAll('.icon-item').forEach(item => {",
        "        item.classList.remove('large', 'medium', 'small');",
        "        item.classList.add(size);",
        "    });",
        "}",
        "window.onload = () => {",
        "    setSize('medium');",
        "    document.querySelectorAll('.group').forEach((group) => {",
        "        new Viewer(group, {",
        "            toolbar: true,",
        "            navbar: true,",
        "            title: [2, (image, imageData) => image.alt],",
        "        });",
        "    });",
        "};",
        "</script>",
        "</body>",
        "</html>",
    ]
)

# 写入 HTML 文件到 Icons/ 目录
with open(html_path, "w", encoding="utf-8") as f:
    f.write("\n".join(html))

print(f"✅ index.html 已生成：{html_path}")
