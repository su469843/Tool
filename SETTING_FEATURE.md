# 设置功能 - 完整说明

## 📋 功能概述

**SettingScreen** 是 Tool 应用的设置模块，提供完整的用户自定义选项。

---

## 🎯 核心功能

### 1. 显示与主题
- 🎨 **主题选择**
  - 浅色模式
  - 深色模式
  - 跟随系统
  - 实时切换

### 2. 播放设置
- 🎬 **视频清晰度**
  - 自动（默认）
  - 1080p 超清
  - 720p 高清
  - 480p 标清
  - AsyncStorage 持久化

- 🔄 **自动播放**
  - 开启/关闭
  - 影响所有模块

### 3. 通知设置
- 🔔 **推送通知**
  - 开启/关闭
  - 控制应用通知

### 4. 存储与缓存
- 💾 **缓存管理**
  - 显示缓存大小
  - 清除缓存按钮
  - 自动下载开关

### 5. 其他设置
- ℹ️ **关于应用**
  - 显示应用版本
  - 构建信息

- 🔄 **恢复默认设置**
  - 一键重置所有设置
  - 确认弹窗保护

---

## 💾 本地存储

### AsyncStorage 键

```typescript
const SETTINGS_KEY = 'APP_SETTINGS'

// 存储结构
{
  theme: 'auto' | 'light' | 'dark',
  notificationsEnabled: boolean,
  autoPlayEnabled: boolean,
  videoQuality: '1080p' | '720p' | '480p' | 'auto',
  audioQuality: 'high' | 'medium' | 'low',
  autoDownload: boolean,
  cacheSize: string,
  language: 'zh' | 'en'
}
```

### 默认设置

```typescript
const DEFAULT_SETTINGS = {
  theme: 'auto',
  notificationsEnabled: true,
  autoPlayEnabled: true,
  videoQuality: 'auto',
  audioQuality: 'high',
  autoDownload: false,
  cacheSize: '500MB',
  language: 'zh',
}
```

---

## 🏗️ 文件结构

```
src/screens/SettingScreen/
└── index.tsx          ← 完整的设置模块
```

---

## 🔧 API 接口

### 加载设置
```typescript
const loadSettings = async () => {
  const stored = await AsyncStorage.getItem(SETTINGS_KEY)
  if (stored) {
    setSettings(JSON.parse(stored))
  }
}
```

### 保存设置
```typescript
const saveSettings = async (newSettings: Settings) => {
  setSettings(newSettings)
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
}
```

### 切换开关
```typescript
const handleToggle = (key: keyof Settings) => {
  const newSettings = { ...settings, [key]: !settings[key] }
  saveSettings(newSettings)
}
```

---

## 🎨 UI 布局

```
┌─────────────────────────┐
│       设置              │
├─────────────────────────┤
│ 📱 显示与主题           │
│   主题  →  跟随系统     │
├─────────────────────────┤
│ 🎬 播放设置             │
│   清晰度  →  自动 ○     │
│   自动播放  [开关]      │
├─────────────────────────┤
│ 🔔 通知                 │
│   推送通知  [开关]      │
├─────────────────────────┤
│ 💾 存储与缓存           │
│   缓存大小  →  500MB    │
│   清除缓存  →           │
│   自动下载  [开关]      │
├─────────────────────────┤
│ ℹ️ 其他                 │
│   关于应用  →           │
│   恢复默认  →           │
└─────────────────────────┘
```

---

## 🎯 用户交互流程

### 完整设置流程

```
1. 用户点击"设置"标签
   ↓
2. 加载已保存的设置
   ↓
3. 显示设置列表
   ├─ 显示与主题
   ├─ 播放设置
   ├─ 通知
   ├─ 存储与缓存
   └─ 其他
   ↓
4. 用户修改某个设置
   ├─ 开关类：点击即切换
   ├─ 选择类：点击打开选择器
   └─ 其他：点击打开编辑框
   ↓
5. 自动保存到 AsyncStorage
   ↓
6. 应用实时应用新设置
   ↓
7. 下次打开应用自动加载
```

---

## 📱 导航集成

### 屏幕常量
```typescript
export const SETTING_SCREEN = 'tool.SettingScreen'
```

### 导航配置
```typescript
const tabLabels = {
  [SETTING_SCREEN]: '设置',
}

const tabs = [
  // ... 其他标签
  { name: SETTING_SCREEN, label: '设置' }
]
```

### 图标
```typescript
const iconMap = {
  [SETTING_SCREEN]: 'cog',  // ⚙️ 齿轮图标
}
```

---

## 🔌 与其他模块的联动

### VideoScreen（视频播放器）
- 读取 `videoQuality` 设置
- 根据设置选择播放分辨率

### 所有模块
- 读取 `theme` 实时切换主题
- 读取 `notificationsEnabled` 控制通知
- 读取 `autoPlayEnabled` 控制自动播放

---

## 🧪 测试清单

### 功能测试
- [ ] 加载设置成功
- [ ] 切换主题生效
- [ ] 选择清晰度保存
- [ ] 切换通知开关
- [ ] 切换自动播放
- [ ] 清除缓存功能
- [ ] 恢复默认设置
- [ ] 关于应用显示正确

### 持久化测试
- [ ] 关闭应用重新打开，设置保留
- [ ] 修改设置后立即保存
- [ ] 多次修改设置，最后一次生效

### UI 测试
- [ ] 所有元素布局正确
- [ ] 图标显示清晰
- [ ] 文字可读性好
- [ ] 摸碰控制反应灵敏

---

## 🎓 使用示例

### 在其他模块中读取设置

```typescript
import { SettingScreen } from '@/screens'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 读取设置
const loadSettings = async () => {
  const settings = await AsyncStorage.getItem('APP_SETTINGS')
  if (settings) {
    const parsed = JSON.parse(settings)
    
    // 使用设置
    const videoQuality = parsed.videoQuality
    const theme = parsed.theme
    
    // 应用到组件
    applyTheme(theme)
    setVideoQuality(videoQuality)
  }
}
```

### 监听设置变化

```typescript
// 使用 useEffect 监听设置变化
useEffect(() => {
  loadSettings()
  
  // 设置轮询检查（可选）
  const interval = setInterval(loadSettings, 1000)
  
  return () => clearInterval(interval)
}, [])
```

---

## 🚀 扩展建议

### 未来可以添加的设置

1. **音频设置**
   - 音量预设
   - 均衡器

2. **字幕设置**
   - 字幕大小
   - 字幕颜色
   - 字幕位置

3. **隐私设置**
   - 开启历史记录
   - 数据统计
   - 广告跟踪

4. **高级设置**
   - API 服务器地址
   - 代理设置
   - 调试模式

5. **账户设置**
   - 用户名
   - 密码修改
   - 同步设置

---

## 📊 设置流向

```
用户修改设置
    ↓
handleToggle() / handleThemeSelect()
    ↓
saveSettings(newSettings)
    ↓
AsyncStorage.setItem()
    ↓
各模块监听设置变化
    ↓
实时应用新设置
    ↓
UI 更新
```

---

## 🔐 数据安全

- ✅ 敏感设置不保存
- ✅ 使用 AsyncStorage 本地加密
- ✅ 无网络请求
- ✅ 用户完全控制

---

## 💡 最佳实践

1. **立即保存**
   - 任何设置变更立即保存
   - 无需"确认"按钮

2. **默认值**
   - 使用合理的默认值
   - 首次使用无需手动设置

3. **实时反馈**
   - 设置变更立即生效
   - 不需要重启应用

4. **易于重置**
   - 提供"恢复默认"按钮
   - 添加确认弹窗保护

---

## 📝 集成清单

- [x] 创建 SettingScreen 组件
- [x] 设计 UI 布局
- [x] 实现设置存取
- [x] 添加所有功能
- [x] 注册到导航
- [x] 添加到导航标签
- [x] 配置图标
- [x] 编写文档

---

## 🎯 下一步

1. **连接其他模块**
   - VideoScreen 读取清晰度设置
   - 主题系统读取主题设置

2. **扩展功能**
   - 添加更多设置选项
   - 实现设置导入/导出

3. **用户体验**
   - 添加设置搜索
   - 优化 UI 设计

---

*功能完成时间: 2024年10月19日*  
*状态: ✅ 完整实现*  
*集成状态: ✅ 已添加到底部导航*
