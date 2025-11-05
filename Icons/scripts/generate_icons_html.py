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
    "    body { background-color: #f9f9f9; color: #000000; }",
    "    .group .icon-item { box-shadow: 0 2px 6px rgba(0,0,0,0.2); }",
    "    .group .icon-item:hover { background-color: #ffffff; }",
    "}",
    "@media (prefers-color-scheme: dark) {",
    "    body { background-color: #222222; color: #ffffff; }",
    "    .group .icon-item { box-shadow: 0 0 0 1px rgba(88,88,88,0.3); }",
    "    .group .icon-item:hover { background-color: #333333; }",
    "}",
    "body { font-family: sans-serif; padding: 20px; }",
    "h1 { text-align: center; }",
    "h2 { margin-top: 2.5rem; }",
    ".group { display: grid; }",
    ".group:has(.icon-wrapper > .icon-item.large) { grid-template-columns: repeat(auto-fit, minmax(144px, 1fr)); gap: 1.7rem 1.4rem; }",
    ".group:has(.icon-wrapper > .icon-item.medium) { grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 1.5rem 1.2rem; }",
    ".group:has(.icon-wrapper > .icon-item.small) { grid-template-columns: repeat(auto-fit, minmax(64px, 1fr)); gap: 1.3rem 1rem; }",
    ".group > .icon-wrapper:has(.icon-item.large) { width: 144px; }",
    ".group > .icon-wrapper:has(.icon-item.medium) { width: 96px; }",
    ".group > .icon-wrapper:has(.icon-item.small) { width: 64px; }",
    ".group > .icon-wrapper:has(.icon-item:hover) { scale: 1.2; z-index: 2; width: unset !important; height: unset !important; }",
    ".group > .icon-wrapper { position: relative; }",
    ".group > .icon-wrapper > .icon-item { border-radius: 6px; cursor: pointer; will-change: scale, background-color; transition: scale 0.25s ease, background-color 0.25s ease; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: transparent; }",
    ".group > .icon-wrapper > .icon-item:hover + .icon-tip { font-size: 1rem; position: absolute; background-color: #666666; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }",
    ".group > .icon-wrapper > .icon-item:hover.large + .icon-tip { width: calc((144px + 10px * 2) * 1.2); left: calc((144px + 10px * 2) * -0.2 / 2); bottom: calc(-1.7rem + 1px); }",
    ".group > .icon-wrapper > .icon-item:hover.medium + .icon-tip { width: calc((96px + 10px * 2) * 1.2); left: calc((96px + 10px * 2) * -0.2 / 2); bottom: calc(-1.5rem + 1px); }",
    ".group > .icon-wrapper > .icon-item:hover.small + .icon-tip { width: calc((64px + 10px * 2) * 1.2); left: calc((64px + 10px * 2) * -0.2 / 2); bottom: calc(-1.3rem + 1px); }",
    ".group > .icon-wrapper > .icon-item > .img-wrapper { padding: 10px; }",
    ".group > .icon-wrapper > .icon-item > .img-wrapper > img { object-fit: contain; width: 100%; height: 100%; }",
    ".group > .icon-wrapper > .icon-item.large { width: inherit; height: 144px; }",
    ".group > .icon-wrapper > .icon-item.medium { width: inherit; height: 96px; }",
    ".group > .icon-wrapper > .icon-item.small { width: inherit; height: 64px; }",
    ".group > .icon-wrapper > .icon-item:hover.large { height: inherit !important; }",
    ".group > .icon-wrapper > .icon-item:hover.medium { height: inherit !important; }",
    ".group > .icon-wrapper > .icon-item:hover.small { height: inherit !important; }",
    ".group > .icon-wrapper > .icon-tip { width: 100%; text-align: center; font-size: 0.875rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; will-change: bottom,font-size,background-color; transition: bottom 0.25s ease, font-size 0.25s ease, background-color 0.25s ease; }",
    "</style>",
    "</head>",
    "<body>",
    "<h1>Icons/Color 图片展示</h1>",
    "<div style=\"text-align:right; margin-bottom:20px;\">",
    "    <label>图标大小：</label>",
    "    <button onclick=\"setSize(\'large\')\">大</button>",
    "    <button onclick=\"setSize(\'medium\')\">中</button>",
    "    <button onclick=\"setSize(\'small\')\">小</button>",
    "</div>",
]

for folder, images in data.items():
    html.append(f"<h2>{folder}</h2>")
    html.append('<div class="group">')
    for img_path in images:
        img_name = os.path.basename(img_path)
        html.extend([
            "<div class=\"icon-wrapper\">",
            f"    <div class=\"icon-item medium\" title=\"{img_name}\">",
            "        <div class=\"img-wrapper\">"
            f"            <img src=\"{img_path}\" alt=\"{img_path}\" />",
            "        </div>",
            "    </div>",
            f"    <div class=\"icon-tip\">{img_name}</div>",
            "</div>"
        ])
    html.append("</div>")

# 添加 JavaScript
html.extend([
    "<script>",
    "function setSize(size) {",
    "    document.querySelectorAll('.icon-item').forEach(item => {",
    "        item.classList.remove('large', 'medium', 'small');",
    "        item.classList.add(size);",
    "    });",
    "}",
    "window.onload = () => setSize('medium');",
    "</script>",
    "</body>",
    "</html>"
])

# 写入 HTML 文件到 Icons/ 目录
with open(html_path, "w", encoding="utf-8") as f:
    f.write("\n".join(html))

print(f"✅ icons.html 已生成：{html_path}")
