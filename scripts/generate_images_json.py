import json
import os

# 图标目录名
ICONS_DIR_NAME = "Icons"

# 输出JSON文件名
OUTPUT_JSON = "images.json"

# 输出Index文件名
OUTPUT_INDEX = "index.html"

# scripts 目录
current_dir = os.path.dirname(os.path.abspath(__file__))

# 目标扫描目录：Icons/
icons_dir = os.path.join(os.path.abspath(os.path.join(current_dir, "..")), ICONS_DIR_NAME)

# 支持的图片扩展名
IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]

# 输出 JSON 文件路径
json_path = os.path.join(os.environ.get("OUTPUT_DIR", "."), OUTPUT_JSON)

# 分组结果
grouped_images = {}

# 处理 Icons 根目录下的图片
root_images = []

def is_image_file(name):
    return os.path.splitext(name)[1].lower() in IMAGE_EXTS

def norm_path_to_icons(path, base_dir):
    """
    将绝对路径 path 转为以 Icons/ 开头的相对路径（使用 / 分隔）
    base_dir 为脚本当前工作目录（起点）
    """
    rel = os.path.relpath(path, start=base_dir)
    rel = rel.replace('\\', '/')
    # 如果相对路径为 '.'，转换为 ICONS_DIR_NAME
    if rel == '.':
        rel = ICONS_DIR_NAME
    # 确保以 ICONS_DIR_NAME 开头
    if not rel.startswith(ICONS_DIR_NAME + '/'):
        if rel == ICONS_DIR_NAME:
            return ICONS_DIR_NAME + '/'
        return rel if rel.startswith(ICONS_DIR_NAME) else f"{ICONS_DIR_NAME}/{rel}"
    return rel

def collect_images_by_dir(root_path, base_dir):
    """
    返回 dict：{ "Icons/dir": ["Icons/file1", ...], ... }
    仅包含至少有一张图片的目录。键和值均以 "Icons/" 开头。
    """
    result = {}
    for dirpath, dirnames, filenames in os.walk(root_path):
        images = []
        for fn in sorted(filenames):
            if is_image_file(fn):
                abs_file = os.path.abspath(os.path.join(dirpath, fn))
                rel_file = os.path.relpath(abs_file, start=base_dir).replace('\\', '/')
                # Ensure it starts with Icons/
                if not rel_file.startswith(ICONS_DIR_NAME + '/'):
                    if rel_file == ICONS_DIR_NAME:
                        rel_file = ICONS_DIR_NAME + '/'
                images.append(rel_file)
        if images:
            # 目录键：相对于 base_dir 的路径，确保以 Icons/... 形式
            rel_dir = os.path.relpath(os.path.abspath(dirpath), start=base_dir).replace('\\', '/')
            if rel_dir == '.':
                rel_dir = ICONS_DIR_NAME
            if not rel_dir.startswith(ICONS_DIR_NAME):
                rel_dir = f"{ICONS_DIR_NAME}/{rel_dir}"
            result[rel_dir] = images
    return result

if not os.path.isdir(icons_dir):
    print(f"错误: 未找到目录 {icons_dir}")
else:
    flat = collect_images_by_dir(icons_dir, "")
    # 保证键排序，输出稳定
    grouped_images = {k: flat[k] for k in sorted(flat.keys())}

# 写入 json 文件到 docs/ 目录
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(grouped_images, f, ensure_ascii=False, indent=2)

print(f"✅ {OUTPUT_JSON} 已生成：{json_path}")
