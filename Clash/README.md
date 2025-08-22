# Clash

## 分流规则

### 推荐配置

[https://github.com/luestr/ProxyResource/tree/main/Tool/Clash/Config](https://github.com/luestr/ProxyResource/tree/main/Tool/Clash/Config)

参考成品配置

[https://github.com/Hackl0us/SS-Rule-Snippet/blob/main/LAZY_RULES/Clash_Premium.yaml](https://github.com/Hackl0us/SS-Rule-Snippet/blob/main/LAZY_RULES/Clash_Premium.yaml)

## 配置项解释

### proxy-providers

> 订阅提供者，对象

```yaml
[订阅名称]:
  type: http
  url: [你的订阅链接]
  interval: 86400
  health-check:
    enable: true
    url: https://www.gstatic.com/generate_204
    # 秒
    interval: 600
```

### proxy-groups

> 策略组，数组

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
# 节点数组
proxies:
```

### rule-providers

> 分流规则

```yaml
[分流规则名称]:
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

### rules

> 规则

基本格式：

```yaml
# 类型,参数,策略(,no-resolve)
TYPE,ARGUMENT,POLICY(,no-resolve)
```

#### rules 指定类型

##### DOMAIN

> 域名

```yaml
DOMAIN,[完整域名],[指定策略]
```

将 `[完整域名]` 路由到 `[指定策略]`.

> 例：
> `DOMAIN,www.google.com,policy` 将 `www.google.com` 路由到 `policy`.

##### DOMAIN-SUFFIX

> 域名后缀

```yaml
DOMAIN-SUFFIX,[域名后缀],[指定策略]
```

将任何以 `[域名后缀]` 结尾的域名路由到 `[指定策略]`.

*注：不要写完整域名*

> 例：
> `DOMAIN-SUFFIX,youtube.com,policy` 将将任何以 `youtube.com` 结尾的域名路由到 `policy`.
> 在这种情况下, `www.youtube.com` 和 `foo.bar.youtube.com` 都将路由到 `policy`.

##### DOMAIN-KEYWORD

> 域名关键字

```yaml
DOMAIN-KEYWORD,[域名关键字],[指定策略]
```

将任何包含 `[域名关键字]` 的关键字的域名路由到 `[指定策略]`.

*注：不要写完整域名 或 域名后缀*

> 例：
> `DOMAIN-KEYWORD,google,policy` 将将任何包含 `google` 关键字的域名路由到 `policy`.
> 在这种情况下, `www.google.com` 和 `googleapis.com` 都将路由到 `policy`.

##### GEOIP

> IP地理位置 (国家代码)

```yaml
GEOIP,[国家代码],[指定策略]
```

将任何目标 IP 地址为 `[国家代码]` 所表示的国家 的数据包路由到 `[指定策略]`.
GEOIP 规则用于根据数据包的目标 IP 地址的国家代码路由数据包. Clash 使用 MaxMind GeoLite2 数据库来实现这一功能.

> [!WARNING]
> 使用这种规则时, Clash 将域名解析为 IP 地址, 然后查找 IP 地址的国家代码. 如果要跳过 DNS 解析, 请使用 `no-resolve` 选项.

> 例：
> `GEOIP,CN,policy` 将任何目标 IP 地址为**中国**的数据包路由到 `policy`.

##### IP-CIDR

> IPv4地址段

```yaml
IP-CIDR,[IPv4地址段],[指定策略]
```

将任何目标 IP 地址为 `[IPv4地址段]` 的数据包路由到 `[指定策略]`.
IP-CIDR 规则用于根据数据包的目标 IPv4 地址路由数据包.

> [!WARNING]
> 使用这种规则时, Clash 将域名解析为 IPv4 地址. 如果要跳过 DNS 解析, 请使用 no-resolve 选项.

> 例：
> `IP-CIDR,127.0.0.0/8,DIRECT` 将任何目标 IP 地址为 `127.0.0.0/8` 的数据包路由到 `DIRECT`.

##### IP-CIDR6

> IPv6地址段

```yaml
IP-CIDR6,[IPv6地址段],[指定策略]
```

将任何目标 IP 地址为 `[IPv6地址段]` 的数据包路由到 `[指定策略]`.
IP-CIDR 规则用于根据数据包的目标 IPv6 地址路由数据包.

> [!WARNING]
> 使用这种规则时, Clash 将域名解析为 IPv6 地址. 如果要跳过 DNS 解析, 请使用 `no-resolve` 选项.

> 例：
> `IP-CIDR6,2620:0:2d0:200::7/32,policy` 将任何目标 IP 地址为 `2620:0:2d0:200::7/32` 的数据包路由到 `DIRECT`.

##### SRC-IP-CIDR

> 源IP段地址

```yaml
SRC-IP-CIDR,[源IP段地址],[指定策略]
```

用于根据数据包的**源 IPv4 地址**路由数据包.

> 例：
> `SRC-IP-CIDR,192.168.1.201/32,DIRECT` 将任何源 IP 地址为 `192.168.1.201/32` 的数据包路由到 `DIRECT`.

##### SRC-PORT

> 源端口

```yaml
SRC-PORT,[源端口],[指定策略]
```

用于根据数据包的**源端口**路由数据包.

> 例：
> `SRC-PORT,80,policy` 将任何源端口为 `80` 的数据包路由到 `policy`.

##### DST-PORT

> 目标端口

```yaml
DST-PORT,[目标端口],[指定策略]
```

用于根据数据包的**目标端口**路由数据包.

> 例：
> `DST-PORT,80,policy` 将任何源端口为 `80` 的数据包路由到 `policy`.

##### PROCESS-NAME

> 源进程名

```yaml
PROCESS-NAME,[源进程名],[指定策略]
```

用于根据发送数据包的进程名称路由数据包.

> [!WARNING]
> 目前, 仅支持 macOS、Linux、FreeBSD 和 Windows.

> 例：
> `PROCESS-NAME,nc,DIRECT` 将任何来自进程 `nc` 的数据包路由到 `DIRECT`.

##### PROCESS-PATH

> 源进程路径

```yaml
PROCESS-PATH,[源进程路径],[指定策略]
```

用于根据发送数据包的进程路径路由数据包.

> [!WARNING]
> 目前, 仅支持 macOS、Linux、FreeBSD 和 Windows.

> 例：
> `PROCESS-PATH,/usr/local/bin/nc,DIRECT` 将任何来自路径为 `/usr/local/bin/nc` 的进程的数据包路由到 `DIRECT`.

##### IPSET (Linux Only)

> IP集

```yaml
IPSET,[IP集],[指定策略]
```

用于根据 IP 集匹配并路由数据包. 根据 IPSET 的官方网站 的介绍:

> IP 集是 Linux 内核中的一个框架, 可以通过 ipset 程序进行管理. 根据类型, IP 集可以存储 IP 地址、网络、 (TCP/UDP) 端口号、MAC 地址、接口名称或它们以某种方式的组合, 以确保在集合中匹配条目时具有闪电般的速度.

因此, 此功能仅在 Linux 上工作, 并且需要安装 `ipset`.

> [!WARNING]
> 使用此规则时, Clash 将解析域名以获取 IP 地址, 然后查找 IP 地址是否在 IP 集中. 如果要跳过 DNS 解析, 请使用 `no-resolve` 选项.

> 例：
> `IPSET,chnroute,policy` 将任何目标 IP 地址在 IP 集 `chnroute` 中的数据包路由到 `policy`.

##### RULE-SET

> 规则集

```yaml
RULE-SET,[规则集],[指定策略]
```

> [!INFO]
> 此功能仅在 Premium 版本 中可用.

用于根据 `rule-providers` 规则集 的结果路由数据包. 当 Clash 使用此规则时, 它会从指定的 Rule Providers 规则集中加载规则, 然后将数据包与规则进行匹配. 如果数据包与任何规则匹配, 则将数据包路由到指定的策略, 否则跳过此规则.

> [!WARNING]
> 使用 RULE-SET 时, 当规则集的类型为 IPCIDR , Clash 将解析域名以获取 IP 地址. 如果要跳过 DNS 解析, 请使用 `no-resolve` 选项.

> 例：
> `RULE-SET,my-rule-provider,DIRECT` 从 `my-rule-provider` 加载所有规则，数据包路由到 `DIRECT`.

##### SCRIPT

> 脚本

```yaml
SCRIPT,[脚本],[指定策略]
```

> [!INFO]
> 此功能仅在 Premium 版本 中可用.

用于根据脚本的结果路由数据包. 当 Clash 使用此规则时, 它会执行指定的脚本, 然后将数据包路由到脚本的输出.

> [!WARNING]
> 使用 SCRIPT 时, Clash 将解析域名以获取 IP 地址. 如果要跳过 DNS 解析, 请使用 `no-resolve` 选项.

> 例：
> `SCRIPT,script-path,DIRECT` 将数据包路由到脚本 `script-path` 的输出，数据包路由到 `DIRECT`.

##### MATCH

> 全匹配

```yaml
MATCH,[指定策略]
```

用于路由剩余的数据包. 该规则是必需的, 通常用作最后一条规则.

> 例：
> `MATCH,policy` 将剩余的数据包路由到 `policy`.

#### rules 指定策略

目前有四种策略类型, 其中:

- DIRECT: 通过 `interface-name` 直接连接到目标 (不查找系统路由表)
- REJECT: 丢弃数据包
- Proxy: 将数据包路由到指定的代理服务器
- Proxy Group: 将数据包路由到指定的策略组（`proxy-groups` 中的某一项 `name`）

在这种情况下, www.youtube.com 和 foo.bar.youtube.com 都将路由到 policy.

## 自定义远程规则文件

基本格式：

```yaml
# UpdateTime：[时间]
# RuleCount：[规则数量]
payload:
  - DOMAIN,www.googleapis.com
  - DOMAIN-SUFFIX,docs.google.com
  - DOMAIN-SUFFIX,drive.google.com
  - DOMAIN-SUFFIX,googledrive.com
  - DOMAIN-SUFFIX,googleusercontent.com
  - USER-AGENT,Google.Drive*
  - USER-AGENT,*com.google.Drive*
  - USER-AGENT,%E4%BA%91%E7%AB%AF%E7%A1%AC%E7%9B%98*
```
