# scat-proxy
configuration of proxy tools

## 项目结构

```
├── .github/workflows/
│   └── detect-icons.yml       # GitHub Actions工作流
├── Clash/                     # clash配置
│   ├── Config/                # clash完整配置文件（无代理节点、代理组）.yaml
│   └── Rules/                 # clash远程规则文件 .yaml
├── Icons/                     # 图标
│   ├── Color/                 # 彩色图标文件目录
│   │   ├── Circle/            # 彩色圆形图标
│   │   ├── Scat/              # 彩色作者头像
│   │   └── ...                # 彩色图标
│   ├── Mono/                  # 单色图标文件目录
│   │   ├── Dark/              # 暗色图标
│   │   └── ...                # 亮色图标
│   ├── scripts/               # 文件生成脚本
├── Loon/                      # Loon配置
│   ├── Config/                # Loon完整配置文件（无代理节点、代理组）.lcf
│   └── Rules/                 # Loon远程规则文件 .lsr
├── docs/                      # GitHub Pages输出目录
│   ├── index.html             # 主页面
│   ├── Color/                 # 拷贝到doc目录下的 彩色图标文件目录
│   │   ├── Circle/            # 拷贝到doc目录下的 彩色圆形图标
│   │   ├── Scat/              # 拷贝到doc目录下的 彩色作者头像
│   │   └── ...                # 拷贝到doc目录下的 彩色图标
│   ├── Mono/                  # 拷贝到doc目录下的 单色图标文件目录
│   │   ├── Dark/              # 拷贝到doc目录下的 暗色图标
│   │   └── ...                # 拷贝到doc目录下的 亮色图标
│   ├── images.json            # 统计图标信息
│   ├── Clash/                 # 拷贝到doc目录下的 clash配置
│   │   ├── Config/            # 拷贝到doc目录下的 clash完整配置文件（无代理节点、代理组）.yaml
│   │   └── Rules/             # 拷贝到doc目录下的 clash远程规则文件 .yaml
│   └── Loon/                  # 拷贝到doc目录下的 Loon配置
│       ├── Config/            # 拷贝到doc目录下的 Loon完整配置文件（无代理节点、代理组）.lcf
│       └── Rules/             # 拷贝到doc目录下的 Loon远程规则文件 .lsr
└── README.md
```

# 分流规则

## rule.kelee.one整理

[https://github.com/luestr/ShuntRules/blob/main/README.md](https://github.com/luestr/ShuntRules/blob/main/README.md)

## blackmatrix7规则

[https://github.com/blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)

# 远程图标配置参考

[https://github.com/luestr/ProxyResource/blob/main/Tool/Loon/Lcf/zh-CN/Loon_Sample_Configuration_By_iKeLee.lcf](https://github.com/luestr/ProxyResource/blob/main/Tool/Loon/Lcf/zh-CN/Loon_Sample_Configuration_By_iKeLee.lcf)

## scat-proxy 集成的图标

> 来自
> 1. [Koolson/Qure](https://github.com/Koolson/Qure)
> 2. [Orz-3/mini](https://github.com/Orz-3/mini)

[点此预览图标](https://jy-mar.github.io/scat-proxy/)

### 使用

- 方式一，`raw.githubusercontent.com` 引用

例：

```
https://raw.githubusercontent.com/JY-Mar/scat-proxy/refs/heads/main/Icons/Color/Back.png
```

- 方式二，`github.io` 直接引用

例：

```
https://jy-mar.github.io/scat-proxy/Icons/Color/Back.png
```
