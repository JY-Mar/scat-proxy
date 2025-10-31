import json
import os

gen_file_name = "icons_index.html"

base_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(base_dir, 'images.json')
html_path = os.path.join(base_dir, gen_file_name)

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

html = ['<!DOCTYPE html>',
        '<html lang="zh-CN">',
        '<head>',
        '<meta charset="UTF-8">',
        '<title>图片展示</title>',
        '<style>',
        'body { font-family: sans-serif; background: #f0f0f0; padding: 20px; }',
        'h2 { margin-top: 40px; }',
        '.group { display: flex; flex-wrap: wrap; gap: 10px; }',
        '.group img { max-width: 200px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }',
        '</style>',
        '</head>',
        '<body>',
        '<h1>Icons/Color 图片展示</h1>']

for folder, images in data.items():
    html.append(f'<h2>{folder}</h2>')
    html.append('<div class="group">')
    for img_path in images:
        html.append(f'<img src="../{img_path}" alt="{img_path}">')
    html.append('</div>')

html.append('</body></html>')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(html))

print(f'✅ {gen_file_name} 已生成：{html_path}')
