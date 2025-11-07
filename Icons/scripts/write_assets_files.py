# viewerjs 文件路径
import os
import re

# 当前脚本所在目录：Icons/scripts/
current_dir = os.path.dirname(os.path.abspath(__file__))

# #region viewerjs
viewerjs_output_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), "viewer.min.js")

# 读取 viewer.min.js
with open(os.path.join(current_dir, "viewer.min.js"), "r", encoding="utf-8") as f:
    viewerjs_content = f.read()

# 写入 viewer.min.js 文件到 Icons/ 目录
with open(viewerjs_output_path, "w", encoding="utf-8") as f:
    f.write(viewerjs_content)
# #endregion

# #region style.css
stylecss_output_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), "style.css")

# 读取 style.css
with open(os.path.join(current_dir, "style.css"), "r", encoding="utf-8") as f:
    stylecss_content = f.read()

def csscompress(css: str) -> str:
    # 去掉注释
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    # 去掉多余空白符
    css = re.sub(r"\s+", " ", css)
    # 去掉大括号前后的空格
    css = re.sub(r"\s*{\s*", "{", css)
    css = re.sub(r"\s*}\s*", "}", css)
    css = re.sub(r"\s*;\s*", ";", css)
    css = re.sub(r"\s*:\s*", ":", css)

    # 去掉重复属性：逐个选择器解析
    def clean_block(block: str) -> str:
        parts = block.split(";")
        seen = {}
        for part in parts:
            if ":" in part:
                prop, val = part.split(":", 1)
                seen[prop.strip()] = val.strip()
        return ";".join([f"{k}:{v}" for k, v in seen.items()])

    compressed = ""
    for selector, body in re.findall(r"([^{}]+){([^{}]+)}", css):
        compressed += selector.strip() + "{" + clean_block(body) + "}"
    return compressed.strip()

# 压缩 CSS 内容
compressed_css = csscompress(stylecss_content)

# 写入 style.css 文件到 Icons/ 目录
with open(stylecss_output_path, "w", encoding="utf-8") as f:
    f.write(compressed_css)
# #endregion