# proxy-groups配置项

```yaml
# 名称
name:
# 如 url-test、fallback、select 等
type: url-test
# 测速的域名
url: http://www.gstatic.com/generate_204
# 测速间隔时间（s）
interval: 1200
# 是否包含所有节点（可与 filter 联用）
include-all: false
# 使用正则表达式筛选节点名称，支持大小写不敏感匹配
filter:
# 字符串数组，指定使用哪些 proxy-providers 中的节点
use:
```
