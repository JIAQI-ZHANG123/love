# 💌 一封给你的信 · 一周年

一个用手写网页做的纪念站：**门禁 → 信封 → 手写信 → 回忆走马灯 → 主页**。
主页里有在一起的天数、回忆时间轴、相册（日历视图）、足迹地图、计划、留言板，内容都存在 Supabase，多设备同步。

线上地址：<https://jiaqi-zhang123.github.io/love/>

## 目录结构

```
love/
├─ index.html          线上首页 ← 由 _src/index-classic.html 构建生成，不要手改
├─ sw.js               Service Worker（离线缓存；每次改版把 love-vN 的 N 加一）
├─ map-geo.js          省界轮廓，进「足迹」时才加载
├─ world-nbr.js        邻国底图，同上
├─ images/             照片与音乐
│  ├─ photo*.webp      回忆照片（117 张）
│  ├─ music.mp3        背景音乐
│  └─ tour/            时间轴卡片用的缩略图（16 张）
└─ _src/               源文件（以下划线开头，GitHub Pages 不会发布）
   ├─ index-classic.html   页面模板 = 构建源
   └─ 一周年信件.txt        信件正文原文
```

## 怎么改

| 想改什么 | 改哪里 |
| --- | --- |
| 信件正文 | `_src/index-classic.html` 的 `.letter-body` 段落（原文也存了 `_src/一周年信件.txt`） |
| 门禁口令 | 在 `love 改进/` 下执行 `node _tools/mkpass.js 新口令`，再重新构建 |
| 打开日期 | `_src/index-classic.html` 里 `gate-js` 的 `OPEN_AT` |
| 照片 / 留言 / 计划 | 不用改代码，直接在网页里增删（存云端） |
| 按钮、颜色、排版 | `_tools/board.css`（留言板/相册/地图等）与 `_src/index-classic.html`（信封/信纸/主页） |

## 构建

在 `love 改进/` 目录下：

```powershell
python _tools/build_romantic.py   # 重新生成 love/index.html
python _tools/_chk.py             # 内联脚本语法自检，应输出 node --check rc 0
```

`_tools/board.js` 是留言板、相册、地图、计划、门禁之后的全部交互逻辑，构建时会被内联进 `index.html`；
`_tools/board-config.js` 里是 Supabase 的地址与公开 key。

## 部署

```powershell
$env:GIT_SSH="C:\Windows\System32\OpenSSH\ssh.exe"
git add -A; git commit -m "说明这次的改动"; git push origin main
```

推到 `main` 后 GitHub Pages 会自动发布（约 1 分钟）。
