# Tool - 全能多功能应用

![Version](https://img.shields.io/badge/version-1.7.2-blue)
![Package](https://img.shields.io/badge/package-io.qzz.hightime.tool-green)
![React Native](https://img.shields.io/badge/react--native-0.73.11-blue)

## 🎯 项目概述

**Tool** 是一个功能丰富的 React Native 多功能应用，整合了抽奖娱乐、AI 对话、视频播放、音乐播放、文件编辑和天气查询等六大核心功能，为用户提供全方位的应用体验。

## ✨ 核心功能

### 🎯 幸运大转盘
- 彩色转盘抽奖界面
- 流畅的旋转动画
- 中奖结果弹窗提示
- 抽奖历史记录
- 震动反馈效果

### 💬 AI 智能对话
- 实时消息对话
- AI 模拟回复系统
- 对话历史保存
- 对话导出功能
- 支持 API 集成

### 🎬 影视播放器
- 视频列表展示
- 全屏播放体验
- 播放进度控制
- 本地/网络视频支持
- 播放历史记录

### 🎵 音乐播放器
- 完整音乐播放功能
- 播放队列管理
- 歌词显示
- 音乐下载
- 本地文件扫描

### 📝 本地文件编辑器
- 10+ 格式支持
- 代码编辑功能
- 文件快速操作
- 最近文件历史
- 文件创建/编辑/删除

### 🌤️ 天气查询
- 多城市天气查询
- 天气小组件支持
- 下拉刷新更新
- 温度、湿度、风速显示
- 数据本地缓存

## 📱 底部导航

应用采用底部标签导航设计，包含 6 个主要功能模块：

```
┌─────────────────────────────────┐
│           应用内容区             │
├─────────────────────────────────┤
│ 转盘 │ AI  │ 视频 │ 音乐 │ 文件 │ 天气 │
└─────────────────────────────────┘
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm >= 8.5.2
- Android SDK (Android 开发)
- Xcode (iOS 开发，可选)

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 代码检查
npm run lint:fix

# 3. 运行开发版本
npm run dev           # Android
npm run ios          # iOS

# 4. 打包发布
npm run pack:android # 生成 APK
```

## 📁 项目结构

```
Tool/
├── src/
│   ├── screens/                  # 屏幕模块
│   │   ├── WheelScreen/         # 转盘
│   │   ├── AIChatScreen/        # AI对话
│   │   ├── VideoScreen/         # 视频
│   │   ├── Home/                # 音乐
│   │   ├── FileEditorScreen/    # 文件编辑
│   │   └── WeatherScreen/       # 天气
│   ├── navigation/              # 导航系统
│   ├── core/                    # 核心模块
│   ├── components/              # 共享组件
│   ├── store/                   # 状态管理
│   └── utils/                   # 工具函数
├── android/                     # Android 配置
├── ios/                         # iOS 配置
└── docs/                        # 文档
```

## 🎨 设计规范

### 颜色方案
- 主色: #007AFF (蓝色)
- 辅助色: #34C759, #FF9500, #FF3B30
- 背景: #F8F9FA
- 卡片: #FFFFFF

### 字体规范
- 标题: 24px Bold
- 副标题: 18px SemiBold
- 正文: 16px Regular
- 说明: 14px Regular

### 间距规范
- 外边距: 20px
- 卡片圆角: 12px
- 按钮圆角: 8px

## 🔧 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React Native | 0.73.11 | 跨平台框架 |
| React Native Navigation | 7.39.2 | 导航管理 |
| TypeScript | 5.8.3 | 类型系统 |
| react-native-svg | 15.7.1 | 矢量图形 |
| react-native-video | 6.2.0 | 视频播放 |
| react-native-fs | 2.20.0 | 文件系统 |
| AsyncStorage | 2.1.2 | 本地存储 |

## 📦 构建与部署

### 调试版本
```bash
npm run pack:android:debug
```

### 发布版本
```bash
npm run pack:android
```

### 输出位置
`android/app/build/outputs/apk/release/`

## 🧪 开发指南

### 添加新屏幕

1. 创建屏幕目录和文件
2. 在 `screenNames.ts` 中定义常量
3. 在 `registerScreens.tsx` 中注册
4. 在 `setupBottomTabs.ts` 中配置导航
5. 在 `screens/index.ts` 中导出

### 数据存储

使用 AsyncStorage 进行本地数据持久化：

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// 保存数据
await AsyncStorage.setItem('key', JSON.stringify(data))

// 读取数据
const data = await AsyncStorage.getItem('key')
```

### 状态管理

项目使用自定义 store 模式管理全局状态：

```typescript
import { useSelector, useDispatch } from '@/store'

const state = useSelector(state => state.theme)
```

## 🔐 安全性

- ✅ 敏感信息不硬编码
- ✅ 权限管理完善
- ✅ 输入验证完整
- ✅ 数据加密就绪

## 🐛 常见问题

### Q: 如何添加新的依赖包？
A: 使用 `npm install package-name`，然后运行 `npm run lint:fix`

### Q: 如何调试应用？
A: 使用 `npm run rd` 启动 React DevTools

### Q: 如何优化应用性能？
A: 参考 `DEPLOYMENT_GUIDE.md` 中的性能优化建议

### Q: 支持哪些文件格式？
A: 文件编辑器支持 .txt, .md, .js, .ts, .tsx, .json, .html, .css, .xml, .java

## 📊 应用信息

| 信息 | 值 |
|------|-----|
| 应用名称 | Tool |
| 包名 | io.qzz.hightime.tool |
| 版本 | 1.7.2 |
| 版本码 | 72 |
| 最低 Android | 5.0+ (API 21+) |
| 推荐 Android | 8.0+ (API 26+) |

## 📖 文档

- [项目结构](./PROJECT_STRUCTURE.md) - 完整的项目结构说明
- [实现总结](./IMPLEMENTATION_SUMMARY.md) - 开发完成总结
- [部署指南](./DEPLOYMENT_GUIDE.md) - 部署和测试指南
- [重构计划](./REFACTOR_PLAN.md) - 原始重构计划

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进本项目。

## 📄 许可证

本项目基于 Apache 2.0 许可证

## 👥 致谢

- 基于 [lx-music-mobile](https://github.com/lyswhut/lx-music-mobile) 开源项目
- 感谢所有贡献者

---

## 🎯 功能特性对比表

| 功能 | 支持 | 说明 |
|------|------|------|
| 抽奖娱乐 | ✅ | 转盘抽奖，历史记录 |
| AI 对话 | ✅ | 支持 API 集成 |
| 视频播放 | ✅ | 本地/网络视频 |
| 音乐播放 | ✅ | 完整功能，支持下载 |
| 文件编辑 | ✅ | 10+ 格式支持 |
| 天气查询 | ✅ | 小组件支持 |
| 离线使用 | ✅ | AsyncStorage 缓存 |
| 暗黑模式 | ✅ | 主题支持 |
| 国际化 | ⏳ | 中文支持，可扩展 |
| 云同步 | ⏳ | 待开发 |

## 📞 联系方式

- GitHub: [项目地址](https://github.com/SnoutLink/lx-music-mobile)
- Issues: [问题反馈](https://github.com/SnoutLink/lx-music-mobile/issues)

---

**准备好了吗？开始使用 Tool 吧！** 🚀

*最后更新: 2024年10月*
*状态: 开发完成，测试中*
