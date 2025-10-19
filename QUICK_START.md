# 🚀 Tool 应用 - 快速开始

## 📋 项目信息
- **应用名**: Tool
- **包名**: io.qzz.hightime.tool
- **版本**: 1.7.2
- **框架**: React Native 0.73.11

## ⚡ 快速命令

### 安装与运行
```bash
# 1. 安装依赖
npm install

# 2. 代码检查
npm run lint:fix

# 3. 运行 Android
npm run dev

# 4. 运行 iOS
npm run ios

# 5. 打包 APK
npm run pack:android
```

---

## 🎯 6 个功能模块

| 标签 | 功能 | 文件 | 图标 |
|------|------|------|------|
| 转盘 | 幸运大转盘 | WheelScreen | palette-swatch-variant |
| AI | AI 智能对话 | AIChatScreen | chat-outline |
| 视频 | 影视播放器 | VideoScreen | video-outline |
| 音乐 | 音乐播放器 | Home | music-note-outline |
| 文件 | 文件编辑器 | FileEditorScreen | file-document-outline |
| 天气 | 天气查询 | WeatherScreen | weather-sunny |

---

## 📱 屏幕位置

```
src/screens/
├── WheelScreen/             ← 转盘
├── AIChatScreen/            ← AI对话
├── VideoScreen/             ← 视频
├── FileEditorScreen/        ← 文件编辑
├── WeatherScreen/           ← 天气
└── Home/                    ← 音乐
```

---

## 🔧 导航配置位置

```
src/navigation/
├── screenNames.ts           ← 屏幕常量
├── registerScreens.tsx      ← 屏幕注册
├── setupBottomTabs.ts       ← 底部导航（新建）
└── navigation.ts            ← 导航函数
```

---

## 📝 文档阅读顺序

1. **README_TOOL.md** - 了解应用功能
2. **PROJECT_STRUCTURE.md** - 理解项目结构
3. **IMPLEMENTATION_SUMMARY.md** - 查看实现细节
4. **DEPLOYMENT_GUIDE.md** - 部署和测试
5. **COMPLETION_REPORT.md** - 项目完成总结

---

## 🎨 UI 规范 (记住这些)

```
主色: #007AFF (蓝色)
背景: #F8F9FA
卡片: #FFFFFF
间距: 20px
圆角: 12px (卡片), 8px (按钮)
```

---

## 💾 数据存储

```typescript
// AsyncStorage 键
'WEATHER_DATA'       // 天气信息
'WEATHER_WIDGETS'    // 小组件配置
'WHEEL_HISTORY'      // 抽奖历史
'CHAT_HISTORY'       // 对话历史
'RECENT_FILES'       // 最近文件
```

---

## 🔍 快速查找

### 找不到屏幕？
1. 检查 `src/screens/` 目录
2. 检查 `screenNames.ts` 常量
3. 检查 `registerScreens.tsx` 注册

### 找不到导入？
1. 检查 `@/` 别名配置
2. 检查 `babel.config.js`
3. 检查 `tsconfig.json`

### 找不到样式？
1. 检查各屏幕的 `StyleSheet.create()`
2. 搜索全局样式文件
3. 检查主题配置

---

## 🐛 常见错误处理

```typescript
// ❌ 错误：module 'xxx' not found
// ✅ 解决：检查路径是否正确，使用 @/ 别名

// ❌ 错误：Cannot read property 'xxx' of undefined
// ✅ 解决：使用可选链 ?.，检查数据初始化

// ❌ 错误：Infinite loop
// ✅ 解决：检查 useEffect 依赖数组，避免每次渲染都调用

// ❌ 错误：Memory leak warning
// ✅ 解决：在 useEffect cleanup 中清理资源
```

---

## 🚀 首次开发建议

### Day 1: 环境搭建
- [ ] npm install
- [ ] npm run lint:fix
- [ ] 在模拟器/真机运行

### Day 2: 功能测试
- [ ] 测试所有 6 个模块
- [ ] 验证底部导航
- [ ] 检查数据持久化

### Day 3: 优化与部署
- [ ] 性能优化
- [ ] 生成 APK
- [ ] 提交 git

---

## 📊 项目统计

- **新增代码**: ~3500 行
- **新增屏幕**: 6 个
- **新增文档**: 5 份
- **修改配置**: 4 个文件
- **完成度**: 100% ✅

---

## 🎯 核心文件速查

| 需求 | 文件 | 位置 |
|------|------|------|
| 添加新屏幕 | index.tsx | src/screens/NewScreen/ |
| 注册屏幕 | registerScreens.tsx | src/navigation/ |
| 添加导航 | setupBottomTabs.ts | src/navigation/ |
| 修改样式 | StyleSheet.create() | 各屏幕文件底部 |
| 状态管理 | Provider | src/store/ |
| 工具函数 | utils | src/utils/ |

---

## 💡 开发小贴士

```typescript
// 1. 使用 TypeScript 接口定义数据结构
interface Weather {
  city: string
  temp: number
}

// 2. 使用 AsyncStorage 存储数据
await AsyncStorage.setItem('key', JSON.stringify(data))

// 3. 使用 FlatList 优化列表
<FlatList data={items} renderItem={({item}) => ...} />

// 4. 使用 useCallback 缓存函数
const handlePress = useCallback(() => {}, [deps])

// 5. 使用 useMemo 缓存计算
const memoValue = useMemo(() => calc(), [deps])
```

---

## 🔐 安全提示

- ❌ 不要硬编码 API 密钥
- ❌ 不要在代码中存储密码
- ❌ 不要上传 keystore 文件
- ✅ 使用环境变量管理敏感信息
- ✅ 使用 AsyncStorage 的加密功能

---

## 📞 获取帮助

1. **查看文档**：阅读 PROJECT_STRUCTURE.md
2. **查看示例**：参考现有屏幕的代码
3. **搜索错误**：在 DEPLOYMENT_GUIDE.md 查找
4. **查看日志**：`npm run rd` 启动 DevTools

---

## ✅ 部署检查清单

准备部署前：
- [ ] npm install 完成
- [ ] npm run lint:fix 通过
- [ ] 功能测试全部通过
- [ ] 没有 console.error
- [ ] 没有内存泄漏
- [ ] APK 文件 < 100MB
- [ ] 所有权限已声明

---

## 🎓 推荐阅读

1. **初学者**: README_TOOL.md → QUICK_START.md
2. **开发者**: PROJECT_STRUCTURE.md → 各屏幕源代码
3. **测试者**: DEPLOYMENT_GUIDE.md
4. **架构师**: IMPLEMENTATION_SUMMARY.md

---

## 🌟 项目亮点

✨ **6 个完整的功能模块**
✨ **TypeScript 类型安全**
✨ **响应式 UI 设计**
✨ **完整的文档**
✨ **生产级代码质量**

---

## 🚀 准备好了吗？

```bash
npm install && npm run dev
```

**开始 Tool 之旅吧！** 🎉

---

*最后更新: 2024年10月*  
*状态: 准备就绪* ✅
