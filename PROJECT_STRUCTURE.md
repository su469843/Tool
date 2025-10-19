# Tool 多功能应用 - 项目结构完整指南

## 项目基本信息
- **应用名称**: Tool
- **版本**: 1.7.2
- **包名**: io.qzz.hightime.tool
- **框架**: React Native 0.73.11
- **状态管理**: 自定义 store
- **导航**: React Native Navigation 7.39.2

---

## 📱 应用功能模块

### 1. 🎯 幸运大转盘 (WheelScreen)
**位置**: `src/screens/WheelScreen/`
**功能**:
- SVG 绘制的彩色转盘（6个扇形奖项）
- 转盘旋转动画（Animated API）
- 随机抽奖算法
- 中奖结果弹窗提示
- 抽奖历史记录（AsyncStorage 持久化）
- 震动反馈效果

**核心组件**:
- Wheel 转盘图形（SVG）
- ResultModal 结果展示
- HistoryList 历史记录列表

---

### 2. 💬 AI 智能对话 (AIChatScreen)
**位置**: `src/screens/AIChatScreen/`
**功能**:
- 实时对话消息列表
- 用户输入框（多行文本支持）
- AI 模拟回复（支持真实 API 集成）
- 对话历史存储（AsyncStorage）
- 对话导出功能
- 键盘自适应布局

**核心组件**:
- MessageBubble 消息气泡
- InputBox 输入框
- ChatHistory 对话历史

---

### 3. 🎬 影视播放器 (VideoScreen)
**位置**: `src/screens/VideoScreen/`
**功能**:
- 视频列表展示（网格布局）
- 全屏播放器
- 播放控制（播放/暂停/进度拖动）
- 横竖屏自适应
- 本地/网络视频支持
- 播放历史记录

**核心组件**:
- VideoList 视频列表
- VideoPlayer 播放器
- PlayerControls 控制工具栏
- 进度条管理

---

### 4. 🎵 音乐播放器 (MusicScreen)
**位置**: `src/screens/Home/` (原有结构保留)
**功能**:
- 音乐列表管理
- 音频播放控制（react-native-track-player）
- 后台播放支持
- 播放进度控制
- 播放队列管理
- 本地音乐文件扫描
- 歌词显示功能
- 音乐下载功能
- 歌词下载

**核心模块**:
- `src/core/player/` - 播放器核心逻辑
- `src/core/music/` - 音乐数据处理
- `src/core/download/` - 下载管理
- `src/core/lyric.ts` - 歌词管理

---

### 5. 📝 本地文件编辑器 (FileEditorScreen)
**位置**: `src/screens/FileEditorScreen/`
**功能**:
- 文件浏览与管理
- 文件创建/编辑/保存
- 多格式支持（.txt, .md, .js, .ts, .tsx, .json, .html, .css, .xml, .java）
- 语法高亮显示
- 最近文件历史
- 文件导入/导出

**支持格式**:
```
.txt, .md, .js, .ts, .tsx, .json, .html, .css, .xml, .java
```

**核心组件**:
- FileList 文件列表
- CodeEditor 代码编辑区
- FileManager 文件管理器
- SyntaxHighlighter 语法高亮

---

### 6. 🌤️ 天气查询 (WeatherScreen) - 新增
**位置**: `src/screens/WeatherScreen/`
**功能**:
- 多城市天气信息查询
- 天气小组件管理
- 小组件添加/删除
- 小组件三种尺寸（小、中、大）
- 下拉刷新更新天气
- 天气数据本地存储（AsyncStorage）
- 显示气温、条件、湿度、风速等信息

**核心特性**:
- 小组件支持独立布局
- 城市管理功能
- 数据持久化存储
- 实时刷新机制

---

## 🗂️ 项目目录结构

```
Tool/
├── src/
│   ├── screens/
│   │   ├── WheelScreen/          ✅ 幸运大转盘
│   │   ├── AIChatScreen/         ✅ AI智能对话
│   │   ├── VideoScreen/          ✅ 影视播放器
│   │   ├── Home/                 ✅ 音乐播放器（原有）
│   │   ├── FileEditorScreen/     ✅ 本地文件编辑器
│   │   ├── WeatherScreen/        ✅ 天气查询（新增）
│   │   ├── PlayDetail/           📋 播放详情（支持屏幕）
│   │   ├── SonglistDetail/       📋 歌单详情
│   │   ├── Comment/              📋 评论区
│   │   └── index.ts              🔗 屏幕导出
│   │
│   ├── navigation/
│   │   ├── screenNames.ts        🎯 屏幕常量定义
│   │   ├── registerScreens.tsx   🔧 屏幕注册
│   │   ├── setupBottomTabs.ts    🎛️ 底部导航配置
│   │   ├── navigation.ts         🚀 导航函数
│   │   ├── hooks.ts
│   │   ├── utils.ts
│   │   ├── event.ts
│   │   └── components/           🎨 模态框组件
│   │
│   ├── core/
│   │   ├── player/               🔊 播放器核心
│   │   ├── music/                🎼 音乐数据处理
│   │   ├── download/             📥 下载管理
│   │   ├── search/               🔍 搜索功能
│   │   ├── lyric.ts              📜 歌词管理
│   │   ├── apiSource.ts          🔌 API源管理
│   │   └── ...                   其他核心模块
│   │
│   ├── components/               🧩 共享组件
│   │   ├── common/
│   │   ├── player/
│   │   └── ...
│   │
│   ├── store/                    🏪 状态管理
│   │   ├── theme/
│   │   ├── setting/
│   │   ├── music/
│   │   ├── songlist/
│   │   └── Provider.tsx
│   │
│   ├── utils/                    🛠️ 工具函数
│   │   ├── data.ts
│   │   ├── download.ts
│   │   ├── music.ts
│   │   ├── windowSizeTools.ts
│   │   ├── hooks.ts
│   │   └── ...
│   │
│   ├── config/                   ⚙️ 配置文件
│   │   ├── constant.ts
│   │   ├── globalData.ts
│   │   └── ...
│   │
│   ├── types/                    📝 TypeScript 类型
│   ├── theme/                    🎨 主题配置
│   ├── lang/                     🌐 国际化
│   ├── app.ts                    🎬 应用入口
│   └── index.ts
│
├── android/                      📱 Android 配置
│   ├── app/
│   │   ├── build.gradle          (已更新：包名改为 io.qzz.hightime.tool)
│   │   └── src/
│   │       └── main/
│   │           └── AndroidManifest.xml  (已更新：包名改为 io.qzz.hightime.tool)
│   └── settings.gradle
│
├── ios/                          🍎 iOS 配置
├── package.json                  📦 项目配置（已更新）
├── app.json                      ⚙️ 应用配置（已更新：名称改为 Tool）
├── tsconfig.json
├── REFACTOR_PLAN.md              📋 重构计划
└── PROJECT_STRUCTURE.md          📄 本文件
```

---

## 🎛️ 底部导航配置

应用使用 React Native Navigation 的底部标签导航，包含 6 个主要模块：

| 标签 | 屏幕 | 图标 | 导出常量 |
|------|------|------|---------|
| 转盘 | WheelScreen | palette-swatch-variant | WHEEL_SCREEN |
| AI对话 | AIChatScreen | chat-outline | AI_CHAT_SCREEN |
| 视频 | VideoScreen | video-outline | VIDEO_SCREEN |
| 音乐 | MusicScreen (Home) | music-note-outline | MUSIC_SCREEN |
| 文件 | FileEditorScreen | file-document-outline | FILE_EDITOR_SCREEN |
| 天气 | WeatherScreen | weather-sunny | WEATHER_SCREEN |

**导航入口**: `src/app.ts` → `pushHomeScreen()` → `setupBottomTabs()`

---

## 🔧 关键技术依赖

### 核心库
- **react-native**: 0.73.11
- **react-native-navigation**: 7.39.2（导航）
- **react-native-track-player**: 自定义（音乐播放）

### UI 组件
- **react-native-vector-icons**: 10.2.0（图标）
- **react-native-svg**: 15.7.1（转盘绘制）

### 功能库
- **react-native-fs**: 2.20.0（文件系统）
- **react-native-document-picker**: 9.1.1（文件选择）
- **react-native-haptic-feedback**: 2.3.3（震动反馈）
- **react-native-video**: 6.2.0（视频播放）

### 数据存储
- **@react-native-async-storage/async-storage**: 2.1.2（本地存储）

### 工具库
- **react-native-quick-base64**: 2.1.2（Base64 编码）
- **react-native-quick-md5**: 3.0.6（MD5 加密）
- **pako**: 2.1.0（压缩库）

---

## 🎨 UI 设计规范

### 颜色方案
```css
主色调: #007AFF (蓝色)
辅助色: #34C759 (绿色), #FF9500 (橙色), #FF3B30 (红色)
中性色: #8E8E93 (灰色), #C7C7CC (浅灰)
背景色: #F8F9FA (浅背景), #FFFFFF (白色)
```

### 字体规范
```css
标题: 24px, Bold
副标题: 18px, SemiBold
正文: 16px, Regular
说明文字: 14px, Regular
标签: 12px, Medium
```

### 间距与圆角
```css
边距: 20px
卡片圆角: 12px
按钮圆角: 8px
阴影: 0px 2px 8px rgba(0,0,0,0.1)
```

---

## 📱 权限配置

### Android 权限（AndroidManifest.xml）
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
```

---

## 🚀 应用启动流程

```
1. index.js → index.tsx
   ↓
2. app.ts (初始化日志、启动事件)
   ↓
3. 初始化导航系统 (navigation/index.ts)
   ↓
4. 注册所有屏幕 (registerScreens.tsx)
   ↓
5. 初始化核心模块 (core/init)
   ↓
6. pushHomeScreen() → setupBottomTabs()
   ↓
7. 显示底部标签导航 (6个主模块)
   ↓
8. 用户交互开始
```

---

## 💾 数据存储

### AsyncStorage 存储键
- `WEATHER_DATA` - 天气信息
- `WEATHER_WIDGETS` - 天气小组件配置
- 其他（由各模块自定义）

### 状态管理
- 使用自定义 store 模式
- 主要状态包括：主题、设置、音乐、歌单等
- 支持实时状态更新

---

## 🔒 签名信息

### Android 签名
- **包名**: io.qzz.hightime.tool
- **应用名**: Tool
- **Debug 签名**: debug.keystore (android)
- **Release 签名**: release.keystore (android)

---

## 📦 构建命令

```bash
npm install                    # 安装依赖
npm run lint                   # 代码检查
npm run lint:fix              # 自动修复
npm run dev                   # Android 开发运行
npm run ios                   # iOS 开发运行
npm run pack:android          # 打包 Android APK
npm run build:theme           # 构建主题
```

---

## ✅ 实现检查清单

- [x] 项目基础配置（包名、应用名）
- [x] 5 个主屏幕功能模块
- [x] 1 个天气查询模块（新增）
- [x] 底部标签导航系统
- [x] 屏幕注册与导出
- [x] 打包配置
- [ ] npm 依赖安装（进行中）
- [ ] 应用编译测试
- [ ] 真机运行测试

---

## 📝 后续优化方向

1. **天气功能增强**
   - 集成真实 API（和风天气、高德地图等）
   - 位置定位功能
   - 小组件通知推送

2. **AI 对话升级**
   - 集成真实 AI API（ChatGPT、文心一言等）
   - 语音输入输出
   - 上下文记忆

3. **音乐功能扩展**
   - 本地歌词同步
   - 音频可视化效果
   - 播放列表分享

4. **文件编辑增强**
   - 代码格式化
   - 实时预览
   - Git 集成

5. **性能优化**
   - 图片懒加载
   - 列表虚拟化
   - 代码分割
   - 内存管理优化

---

## 👨‍💻 开发指南

### 添加新功能模块
1. 在 `src/screens/` 下创建新目录
2. 导出到 `src/screens/index.ts`
3. 在 `screenNames.ts` 中添加常量
4. 在 `registerScreens.tsx` 中注册
5. 在 `setupBottomTabs.ts` 中添加到导航

### 修改样式规范
- 保持现有颜色方案
- 统一间距 20px
- 卡片圆角 12px
- 按钮圆角 8px

### 添加新类型
- 在 `src/types/` 下创建类型文件
- 使用 TypeScript 确保类型安全
- 导出到 `src/types/index.ts`

---

## 📞 联系与支持

项目基于 lx-music-mobile 音乐应用改造
新增功能由 Tool 项目负责维护

---

*最后更新: 2024年10月*
