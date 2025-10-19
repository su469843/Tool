# Tool 应用重构方案

## 项目信息
- **应用名称**: Tool
- **包名**: io.qzz.hightime.tool
- **基础框架**: React Native 0.73.11
- **现有资源**: lx-music-mobile 音乐应用核心模块

---

## 📋 重构策略

### 第一阶段：项目基础设置 ✅ (已完成)
- [x] 更新 app.json (应用名称 → Tool)
- [x] 更新 package.json (项目名称 → Tool)
- [x] 更新 Android 包名 (→ io.qzz.hightime.tool)
- [x] 更新 AndroidManifest.xml 包名

### 第二阶段：导航结构重构 (待开始)
**目标**: 建立底部标签导航，包含5个主要模块

```
src/screens/
├── WheelScreen/          (幸运大转盘)
├── AIChatScreen/         (AI智能对话)
├── VideoScreen/          (影视播放器)
├── MusicScreen/          (音乐播放器 - 保留)
└── FileEditorScreen/     (本地文件编辑器)
```

**导航配置**:
```typescript
src/navigation/BottomTabNavigator.ts
- 5个标签项
- 图标配置
- 路由映射
```

### 第三阶段：功能模块开发

#### 模块1: 幸运大转盘 (WheelScreen)
**来源**: 全新开发
**依赖库**: 
- react-native-svg (绘图)
- react-native (Animated API)
- react-native-haptic-feedback (震动反馈)

**功能清单**:
- [ ] 转盘绘制 (6个扇形区域)
- [ ] 旋转动画
- [ ] 随机抽奖算法
- [ ] 中奖结果展示
- [ ] 抽奖历史记录 (AsyncStorage)

**文件结构**:
```
src/screens/WheelScreen/
├── index.tsx
├── components/
│   ├── Wheel.tsx
│   ├── ResultModal.tsx
│   └── HistoryList.tsx
└── utils/
    └── wheelLogic.ts
```

---

#### 模块2: AI智能对话 (AIChatScreen)
**来源**: 全新开发
**依赖库**:
- react-native-keyboard-aware-scroll-view (键盘自适应)
- (可选) API集成库

**功能清单**:
- [ ] 对话消息列表
- [ ] 实时输入框
- [ ] 消息发送/接收
- [ ] 对话历史存储
- [ ] 消息导出功能

**文件结构**:
```
src/screens/AIChatScreen/
├── index.tsx
├── components/
│   ├── MessageBubble.tsx
│   ├── InputBox.tsx
│   └── ChatHistory.tsx
└── utils/
    └── chatLogic.ts
```

---

#### 模块3: 影视播放器 (VideoScreen)
**来源**: 全新开发
**依赖库**:
- react-native-video (视频播放)
- react-native-orientation-locker (屏幕旋转)

**功能清单**:
- [ ] 视频列表展示
- [ ] 全屏播放
- [ ] 播放控制
- [ ] 横竖屏自适应
- [ ] 本地/网络视频支持

**文件结构**:
```
src/screens/VideoScreen/
├── index.tsx
├── components/
│   ├── VideoList.tsx
│   ├── VideoPlayer.tsx
│   └── PlayerControls.tsx
└── utils/
    └── videoLogic.ts
```

---

#### 模块4: 音乐播放器 (MusicScreen) - 保留现有
**来源**: 从原项目迁移
**保留内容**:
- `src/core/player/` - 播放器核心
- `src/core/music/` - 音乐数据处理
- `src/core/download/` - 下载功能
- `src/core/lyric.ts` - 歌词管理

**调整项**:
- 移除原项目的其他模块依赖
- 集成到新的导航结构

---

#### 模块5: 本地文件编辑器 (FileEditorScreen)
**来源**: 全新开发
**依赖库**:
- react-native-fs (文件系统)
- react-native-document-picker (文件选择)
- react-native-syntax-highlighter (语法高亮)

**支持格式**: .txt, .md, .js, .ts, .tsx, .json, .html, .css, .xml, .java

**功能清单**:
- [ ] 文件浏览/管理
- [ ] 文件创建/编辑/保存
- [ ] 多格式支持
- [ ] 语法高亮
- [ ] 最近文件历史
- [ ] 文件导入/导出

**文件结构**:
```
src/screens/FileEditorScreen/
├── index.tsx
├── components/
│   ├── FileList.tsx
│   ├── CodeEditor.tsx
│   ├── FileManager.tsx
│   └── SyntaxHighlighter.tsx
└── utils/
    ├── fileLogic.ts
    └── syntaxRules.ts
```

---

## 📁 项目目录结构规划

```
Tool/
├── src/
│   ├── screens/
│   │   ├── WheelScreen/
│   │   ├── AIChatScreen/
│   │   ├── VideoScreen/
│   │   ├── MusicScreen/          (保留+优化)
│   │   └── FileEditorScreen/
│   ├── navigation/
│   │   ├── BottomTabNavigator.ts
│   │   └── RootNavigator.ts
│   ├── core/                     (保留音乐核心)
│   │   ├── player/
│   │   ├── music/
│   │   ├── download/
│   │   └── lyric.ts
│   ├── components/               (共享组件)
│   │   ├── common/
│   │   └── ...
│   ├── store/                    (状态管理)
│   ├── utils/                    (工具函数)
│   ├── config/                   (配置文件)
│   ├── types/                    (TypeScript类型)
│   ├── theme/                    (主题配置)
│   ├── app.ts                    (应用入口)
│   └── index.ts
├── android/                      (已配置)
├── ios/
├── package.json                  (已更新)
├── app.json                      (已更新)
└── ...
```

---

## 🔧 技术实现要点

### 1. 导航集成
```typescript
// src/navigation/BottomTabNavigator.ts
使用 react-native-navigation v7.39.2
5个标签: 转盘、AI对话、视频、音乐、文件编辑
```

### 2. 状态管理
```typescript
保留现有 store/ 结构
扩展支持:
- 转盘结果历史
- AI对话记录
- 文件编辑状态
- 视频播放列表
```

### 3. 权限管理
```java
AndroidManifest.xml 需要权限:
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- INTERNET
- ACCESS_FINE_LOCATION (可选)
- RECORD_AUDIO (AI语音可选)
```

### 4. 库依赖管理
```json
需要新增:
- react-native-svg (图表绘制)
- react-native-video (视频播放)
- react-native-fs (文件系统)
- react-native-document-picker (文件选择)
- react-native-haptic-feedback (震动反馈)
```

---

## 🎯 实现优先级

**高优先级** (必须):
1. 导航结构重构
2. 音乐播放器迁移
3. 文件编辑器基础功能

**中优先级** (重要):
4. 幸运大转盘
5. 影视播放器

**低优先级** (增强):
6. AI智能对话 (涉及API集成)
7. 高级功能完善

---

## ✅ 验收标准

- [ ] 5个模块正常显示在底部导航
- [ ] 每个模块都能独立运行
- [ ] 音乐播放器功能完整
- [ ] 没有console.warn/error
- [ ] APK能正常安装和运行
- [ ] 签名正确: io.qzz.hightime.tool

---

## 📝 后续步骤

1. **确认方案** - 您确认上述重构计划？
2. **开始实现** - 从导航结构开始逐步开发
3. **集成测试** - 各模块联调测试
4. **优化发布** - 性能优化和APK打包

