# Tool 应用 - 部署与测试指南

## 🚀 快速开始

### 前置要求
- Node.js >= 18
- npm >= 8.5.2
- Android SDK（用于 Android 开发）
- Xcode（用于 iOS 开发，可选）

### 第一步：安装依赖
```bash
npm install

# 如果遇到版本冲突，使用
npm install --legacy-peer-deps --force
```

### 第二步：代码检查
```bash
npm run lint

# 自动修复代码风格
npm run lint:fix
```

### 第三步：开发运行

#### Android 开发
```bash
# 确保 Android 模拟器运行或连接真机
npm run dev

# 或使用全架构
react-native run-android
```

#### iOS 开发（macOS）
```bash
npm run ios
```

---

## 📦 构建与打包

### Android APK 打包

#### 调试版本
```bash
npm run pack:android:debug
```

#### 发布版本
```bash
npm run pack:android
```

**输出位置**: `android/app/build/outputs/apk/release/`

### 生成线性通用 APK
```bash
npm run bundle-android
```

---

## 🧪 测试

### 单元测试
```bash
npm test
```

### 代码风格检查
```bash
npm run lint
```

### 类型检查
```bash
npx tsc --noEmit
```

---

## 🔍 常见问题排查

### 问题1：依赖安装失败
**症状**: npm install 超时或报错
**解决**:
```bash
# 清除缓存
npm cache clean --force

# 重新安装
npm install --legacy-peer-deps
```

### 问题2：模块找不到
**症状**: `Cannot find module '@/screens/...'`
**解决**:
- 检查路径别名配置：`babel.config.js`
- 检查 `tsconfig.json` 的 `paths` 配置
- 重新安装依赖

### 问题3：Android 编译错误
**症状**: `./gradlew` 命令失败
**解决**:
```bash
# 清除旧构建
npm run clear

# 重新编译
npm run dev
```

### 问题4：屏幕不显示
**症状**: 底部标签导航不显示
**解决**:
- 检查 `setupBottomTabs.ts` 图标加载
- 检查 `registerScreens.tsx` 屏幕注册
- 确认 `app.ts` 正确调用 `pushHomeScreen()`

---

## 🏗️ 项目结构快速查询

### 添加新屏幕模块

1. **创建屏幕文件**
```bash
mkdir src/screens/NewScreen
touch src/screens/NewScreen/index.tsx
```

2. **编写屏幕组件**
```typescript
// src/screens/NewScreen/index.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const NewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>新屏幕</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})

export default NewScreen
```

3. **注册屏幕**

在 `src/navigation/screenNames.ts`:
```typescript
export const NEW_SCREEN = 'tool.NewScreen'
```

在 `src/navigation/registerScreens.tsx`:
```typescript
import NewScreen from '@/screens/NewScreen'

export default () => {
  Navigation.registerComponent(NEW_SCREEN, () => WrappedComponent(NewScreen))
  // ...
}
```

4. **添加到导出**

在 `src/screens/index.ts`:
```typescript
export { default as NewScreen } from './NewScreen'
```

5. **添加到导航**

在 `src/navigation/setupBottomTabs.ts`:
```typescript
const tabs = [
  // ... 其他标签
  { name: NEW_SCREEN, label: '新页面' }
]
```

---

## 🎯 功能测试清单

### 转盘功能
- [ ] 转盘旋转动画流畅
- [ ] 随机抽奖结果正确
- [ ] 历史记录正确保存
- [ ] 震动反馈有效

### AI 对话
- [ ] 消息输入输出正常
- [ ] 对话历史正确保存
- [ ] 清空功能正常
- [ ] 导出功能正常

### 视频播放
- [ ] 列表显示正确
- [ ] 播放器能启动
- [ ] 进度条可拖动
- [ ] 全屏功能正常

### 音乐播放
- [ ] 所有原功能保留
- [ ] 与其他模块无冲突
- [ ] 歌词正确显示
- [ ] 下载功能正常

### 文件编辑
- [ ] 文件创建成功
- [ ] 编辑内容保存
- [ ] 文件删除正确
- [ ] 格式选择正常

### 天气查询
- [ ] 城市添加正常
- [ ] 小组件添加正确
- [ ] 下拉刷新有效
- [ ] 数据持久化正常

### 导航
- [ ] 底部标签显示完整
- [ ] 标签切换流畅
- [ ] 标签图标清晰
- [ ] 返回按钮正常

---

## 📊 性能优化建议

### 内存优化
```typescript
// 使用 useCallback 避免函数重复创建
const handlePress = useCallback(() => {
  // 处理逻辑
}, [dependency])

// 使用 useMemo 缓存计算结果
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])
```

### 列表优化
```typescript
// 启用 removeClippedSubviews
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### 图片优化
```typescript
// 使用图片缓存
import { Image } from 'react-native'

Image.prefetch(imageUrl)
```

---

## 🔐 发布前检查清单

### 代码质量
- [ ] 所有 ESLint 警告已解决
- [ ] 无 TypeScript 错误
- [ ] 代码格式统一
- [ ] 注释完整清晰

### 功能测试
- [ ] 所有功能模块都测试过
- [ ] 没有运行时错误
- [ ] 性能表现良好
- [ ] 电池消耗在可接受范围

### 配置检查
- [ ] 包名正确：`io.qzz.hightime.tool`
- [ ] 应用名正确：`Tool`
- [ ] 版本号正确
- [ ] 权限配置完整

### 文档
- [ ] README 已更新
- [ ] 更新日志已记录
- [ ] 用户指南已准备
- [ ] 开发文档已完善

---

## 📱 设备要求

### 最低要求
- **Android**: 5.0+ (API 21+)
- **iOS**: 12.0+ (可选)
- **RAM**: 2GB 最低
- **存储**: 100MB 最低

### 推荐配置
- **Android**: 8.0+ (API 26+)
- **iOS**: 14.0+
- **RAM**: 4GB+
- **存储**: 300MB+

---

## 🌐 国际化支持

当前支持语言：中文

扩展其他语言：
```typescript
// src/lang/index.ts
export const translations = {
  'zh-CN': { /* 中文 */ },
  'en-US': { /* 英文 */ }
}
```

---

## 🔄 版本管理

### 更新版本
```json
{
  "version": "1.7.2",
  "versionCode": 72
}
```

更新步骤：
1. 修改 `package.json` 的 `version`
2. 修改 `package.json` 的 `versionCode`
3. 修改 `android/app/build.gradle` 中的版本
4. 更新 `CHANGELOG.md`
5. 提交 git 并打 tag

---

## 🚨 错误日志

### 查看日志
```bash
# Android logcat
adb logcat | grep ReactNative

# 或使用 React DevTools
npm run rd
```

### 常见错误
```
Error: Cannot find module 'xxx'
→ 检查导入路径，使用 @/aliases

Error: Native module not found
→ 运行 npm install，重新编译

Error: Undefined is not an object
→ 检查异步数据加载，使用 optional chaining (?.)
```

---

## 📞 获取帮助

### 官方资源
- [React Native 官网](https://reactnative.dev)
- [React Native Navigation](https://wix.github.io/react-native-navigation)
- [AsyncStorage 文档](https://react-native-async-storage.github.io/async-storage)

### 社区支持
- GitHub Issues
- Stack Overflow
- React Native 中文社区

---

## 📝 更新日志模板

```markdown
## [1.7.2] - 2024-10-19

### 新增
- 幸运大转盘功能
- AI 智能对话
- 影视播放器
- 本地文件编辑器
- 天气查询与小组件

### 改进
- 项目包名更新为 io.qzz.hightime.tool
- 底部导航重构
- 界面设计优化

### 修复
- 修复导航问题
- 优化内存使用

### 移除
- 移除废弃模块
```

---

## 🎓 开发资源

### 推荐学习
- React Native 官方教程
- TypeScript 快速开始
- Redux 状态管理（可选升级）

### 代码规范
- ESLint 配置参考
- Prettier 代码格式化
- TypeScript 最佳实践

---

## ✅ 最终检查清单

部署前：
- [ ] npm install 完成
- [ ] npm run lint:fix 通过
- [ ] 所有测试通过
- [ ] APK 文件大小合理（< 100MB）
- [ ] 没有硬编码密钥或敏感信息
- [ ] 权限声明完整
- [ ] 应用图标已设置
- [ ] 启动画面已配置

部署后：
- [ ] 在真机上完整测试
- [ ] 验证所有功能正常
- [ ] 性能监控设置
- [ ] 崩溃日志收集配置
- [ ] 用户反馈通道建立

---

*最后更新: 2024年10月*
*准备就绪: npm install 完成后即可部署*
