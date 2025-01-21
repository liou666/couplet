# <img src="./resources/icon.ico" width="80px" align="center" alt="couplet icon"> Couplet - 桌面对联
>
> 把春节氛围带到你的电脑桌面！

<p align="left">
<a href="https://github.com/liou666/couplet/releases" target="_blank">
<img alt="macOS" src="https://img.shields.io/badge/-macOS-black?style=flat-square&logo=apple&logoColor=white" />
</a>
<a href="https://github.com/liou666/couplet/releases" target="_blank">
<img alt="Windows" src="https://img.shields.io/badge/-Windows-blue?style=flat-square&logo=windows&logoColor=white" />
</a>
<a href="https://github.com/liou666/couplet/releases" target="_blank">
<img alt="Linux" src="https://img.shields.io/badge/-linux-red?style=flat-square&logo=linux&logoColor=white" />
</a>
<a href="https://github.com/liou666/couplet/releases" target="_blank">
<img alt="Downloads" src="https://img.shields.io/github/downloads/liou666/couplet/total.svg?style=flat" />
</a>
</p>

Couplet 是一款跨平台桌面应用，让传统春联以现代方式展现在你的电脑上 🧨！

<p align="center">
  <img width="" alt="Screenshot: couplet App running" src="./screenshots/image-mac.png">
</p>

## 📥 下载

| 平台 | 下载链接 |
| :-- | --- |
| **Mac(Apple Silicon)** | [下载](https://github.com/liou666/couplet/releases/download/v0.1.0/couplet_arm64_0.1.0.dmg) |
| **Mac(Inter)** | [下载](https://github.com/liou666/couplet/releases/download/v0.1.0/couplet_x64_0.1.0.dmg) |
| **Windows** | [下载](https://github.com/liou666/couplet/releases/download/v0.1.0/couplet_0.1.0.exe) |
| **Linux** | [下载](https://github.com/liou666/couplet/releases/download/v0.1.0/couplet_0.1.0.AppImage) |

更多版本请访问 **[GitHub Releases](https://github.com/liou666/couplet/releases)**

## ✨ 特性

- 😊 桌面实时展示春联：让你的桌面年味十足！
- 🎨 自定义字体和样式：随心搭配，个性化设置。
- 🚀 跨平台支持（Windows、macOS、Linux）
- 🌙 深色模式适配
- 🌍 多语言支持（开发中）

## 🛠️ 开发

```bash
# 1. 克隆该仓库;
git clone https://github.com/liou666/couplet.git

# 2. 安装依赖;
cd couplet
pnpm install

# 如果 Electron 安装失败，可以尝试使用淘宝镜像源👇:
# export ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/ && pnpm i

# 3. 启动服务
pnpm dev
```

## 💭 常见问题

<details>
<summary>1. MacOS 提示无法打开“桌面对联”，因为Apple无法检查其是否包含恶意软件。</summary>
如遇到"无法打开应用程序"的安全提示，可：

1. 在"系统偏好设置 > 安全性与隐私"中允许应用运行
2. 或通过终端执行：

```bash
xattr -rd com.apple.quarantine /path/to/Couplet.app
```

<details>

## 📄 License

[MIT](./LICENSE)
