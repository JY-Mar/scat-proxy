# proxy-groups配置项

> 策略组

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

# rule-providers配置项

> 分流规则

```yaml
enabled: true
# 以远程下载的方式获取代理
type: http
# 规则行为（domain-匹配域名规则,ipcidr-匹配IP段规则,classical-传统规则格式,http-用于HTTP请求规则）
behavior: domain
# 填写你的订阅链接
url:
# 从订阅链接下载存到本地的文件
path:
# 更新间隔(s)
interval: 3600
# 节点健康检查（每小时更新一次订阅节点，每 6 秒一次健康检查）
health-check:
  enable: true
  url: http://www.gstatic.com/generate_204
  interval: 6 # 节点健康检查间隔(s) 
```
  
# 分流规则
# 规则可查询：https://github.com/luestr/ShuntRules/blob/main/README.md，或 https://github.com/blackmatrix7/ios_rule_script
