# LYQ.DEV · 个人网站

> 没头发，但有想法。—— NO HAIR, FULL STACK

一个 **新粗野主义（Neo-Brutalism）× 贴纸涂鸦** 风格的个人网站，
纯 HTML / CSS / JavaScript，零依赖、零构建，打开即用。

## 🚀 怎么打开

直接双击 `index.html` 用浏览器打开即可。
（想要本地服务器：在该目录运行 `python3 -m http.server 8000`，然后访问 http://localhost:8000）

## ✏️ 怎么改成自己的

所有需要改的地方都在代码里用 `✏️` 注释标出来了：

| 想改什么 | 去哪里改 |
| --- | --- |
| 名字（LYQ） | `index.html` 里搜索 `LYQ`，全部替换成你的名字 |
| 头像 | 替换 `assets/avatar.png`（方形图片即可） |
| 产品卡片 | `index.html` 中 `#work` 区域，每个 `<article class="card">` 是一个产品 |
| GitHub / 邮箱 / B站链接 | `#work` 的 ghost-card 和 `#contact` 的按钮，搜索 `你的ID` |
| 冷知识 / 数值条 | `#about` 区域，随便改成你的真实情况（或者不改，也很好笑） |
| 主色调 | `style.css` 顶部的 `:root` 变量 |

## 🎮 内置彩蛋

1. **戳光头** —— 首页那个大脑袋可以拖拽甩动，点它会弹 "AI"，戳满 10 次有惊喜
2. **科拿米秘技** —— 键盘输入 `↑↑↓↓←→←→BA`
3. **F12** —— 控制台里有话对你说
4. **动画开关** —— 右下角「🎬 动画」按钮随时开关全部动效，选择会记住；
   就算系统开了「减少动态效果」，动画也照常播放（不想看再手动关）

## 🌐 怎么发布（全免费）

- **GitHub Pages**：推到 GitHub 仓库 → Settings → Pages → 选分支即可
- **Vercel / Netlify**：把整个文件夹拖上去就行，10 秒部署

## 📁 文件结构

```
personal-site/
├── index.html    页面结构（文案都在这）
├── style.css     全部样式（设计变量在 :root）
├── script.js     交互逻辑（物理引擎/彩蛋/动效）
├── assets/
│   └── avatar.png 你的头像
└── README.md     本文件
```
