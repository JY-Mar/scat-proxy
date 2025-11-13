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
│   ├── Color/                 # 资源文件目录（彩色图标）
│   │   ├── Circle/            # 圆形图标
│   │   └── Scat/              # 作者头像
│   ├── scripts/               # 文件生成脚本
├── Loon/                      # Loon配置
│   ├── Config/                # Loon完整配置文件（无代理节点、代理组）.lcf
│   └── Rules/                 # Loon远程规则文件 .lsr
├── docs/                      # GitHub Pages输出目录
│   ├── index.html             # 主页面
│   ├── Color/                 # 拷贝到doc目录下的资源文件目录（彩色图标）
│   │   ├── Circle/            # 圆形图标
│   │   └── Scat/              # 作者头像
│   └── images.json            # 统计图标信息
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
https://jy-mar.github.io/scat-proxy/Color/Back.png
```
