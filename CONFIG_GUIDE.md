# 配置文件指南 - appConfig.js

## 📋 概述

`src/config/appConfig.js` 是 Tool 应用的中央配置文件，使用 **JavaScript 语法**编写，提供灵活的配置管理系统。

---

## 🎯 核心概念

### 为什么使用 JS 配置？

✅ **灵活性**: 支持任何 JS 对象和计算  
✅ **可扩展**: 轻松添加新配置项  
✅ **易维护**: 清晰的结构和注释  
✅ **动态配置**: 支持运行时修改  
✅ **工具函数**: 提供 `getConfig()` 和 `setConfig()` 方法  

---

## 📁 配置结构

```
appConfig = {
  app              // 应用基本信息
  player           // 播放设置
  search           // 搜索设置
  list             // 列表设置
  download         // 下载设置
  theme            // 主题设置
  common           // 通用设置
  musicSources     // 音乐源配置
  videoSources     // 视频源配置
  shortcuts        // 快捷键配置
  features         // 功能开关
  api              // API 配置
  sync             // 同步配置
  desktopLyric     // 桌面歌词配置
  notification     // 通知配置
  logging          // 日志配置
  advanced         // 高级设置
}
```

---

## 🔧 使用方法

### 1. 导入配置

```typescript
import { appConfig, getConfig, setConfig } from '@/config/appConfig'
```

### 2. 获取配置值

```typescript
// 方式1: 直接访问
const volume = appConfig.player.volume

// 方式2: 使用 getConfig（推荐）
const volume = getConfig('player.volume')
const defaultVolume = getConfig('player.volume', 1) // 带默认值
```

### 3. 设置配置值

```typescript
// 方式1: 直接修改（不建议）
appConfig.player.volume = 0.5

// 方式2: 使用 setConfig（推荐）
setConfig('player.volume', 0.5)
```

### 4. 批量修改（合并）

```typescript
import { mergeConfig } from '@/config/appConfig'

mergeConfig({
  player: {
    volume: 0.8,
    playQuality: '320k'
  }
})
```

---

## 📊 详细配置说明

### 应用信息 (app)

```javascript
app: {
  name: 'Tool',              // 应用名称
  version: '1.7.2',          // 版本号
  versionCode: 72,           // 版本代码
  package: 'io.qzz.hightime.tool', // 包名
}
```

### 播放器 (player)

```javascript
player: {
  playQuality: '128k',       // 播放质量
  togglePlayMethod: 'listLoop', // 播放模式
  volume: 1,                 // 音量 (0-1)
  playbackRate: 1,           // 播放速度
  cacheSize: 1024,           // 缓存大小 (MB)
  isSavePlayTime: false,     // 保存播放时间
  isHandleAudioFocus: true,  // 音频焦点处理
  isEnableAudioOffload: true, // 音频卸载
  // ... 更多选项
}
```

### 音乐源 (musicSources)

```javascript
musicSources: [
  {
    id: 'netease',           // 源 ID
    name: '网易云音乐',      // 源名称
    enabled: true,           // 是否启用
    priority: 1,             // 优先级
  },
  // ... 其他源
]
```

---

## 🎵 播放设置说明

### 播放质量 (playQuality)

| 值 | 说明 | 码率 |
|-----|------|------|
| `128k` | 低质量 | 128 kbps |
| `192k` | 中质量 | 192 kbps |
| `320k` | 高质量 | 320 kbps |
| `flac` | 无损音质 | 无损压缩 |

### 播放模式 (togglePlayMethod)

| 值 | 说明 |
|-----|------|
| `listLoop` | 列表循环 |
| `listOnce` | 列表顺序播放 |
| `songLoop` | 单曲循环 |
| `random` | 随机播放 |

### 音源选择 (apiSource)

| ID | 源名称 |
|-----|---------|
| `netease` | 网易云音乐 |
| `qq` | QQ 音乐 |
| `kugou` | 酷狗音乐 |
| `kuwo` | 酷我音乐 |
| `migu` | 咪咕音乐 |
| `bilibili` | 哔哩哔哩 |

---

## 🎨 主题配置 (theme)

```javascript
theme: {
  id: 'green',               // 主题 ID
  lightId: 'green',          // 浅色主题
  darkId: 'black',           // 深色主题
  hideBgDark: false,         // 隐藏深色背景
  dynamicBg: false,          // 动态背景
  fontShadow: false,         // 字体阴影
}
```

---

## 🔌 API 配置 (api)

```javascript
api: {
  timeout: 30000,            // 超时时间 (ms)
  retryCount: 3,             // 重试次数
  retryDelay: 1000,          // 重试延迟 (ms)
  cacheTime: 5 * 60 * 1000,  // 缓存时间 (5分钟)
}
```

---

## 🎥 视频源配置 (videoSources)

```javascript
videoSources: [
  {
    id: 'youku',
    name: '优酷',
    enabled: true,
    priority: 1,
  },
  {
    id: 'iqiyi',
    name: '爱奇艺',
    enabled: true,
    priority: 2,
  },
  // ... 更多源
]
```

---

## ⚙️ 工具函数

### getConfig(path, defaultValue)

获取配置值，支持点符号路径

```typescript
// 获取播放质量
const quality = getConfig('player.playQuality')

// 获取音乐源（带默认值）
const source = getConfig('player.apiSource', 'netease')

// 获取嵌套值
const fontSize = getConfig('desktopLyric.style.fontSize', 180)
```

### setConfig(path, value)

设置配置值

```typescript
// 设置音量
setConfig('player.volume', 0.8)

// 设置播放质量
setConfig('player.playQuality', '320k')

// 设置嵌套值
setConfig('desktopLyric.position.x', 100)
```

### mergeConfig(customConfig)

合并自定义配置

```typescript
mergeConfig({
  player: {
    volume: 0.9,
    playQuality: 'flac'
  },
  theme: {
    id: 'blue'
  }
})
```

---

## 📱 在设置页面中的使用

设置页面 (SettingScreen) 已集成以下配置：

```typescript
// 音乐播放设置
- 音乐质量选择
- 播放模式选择
- 音源选择

// 视频播放设置
- 视频清晰度选择

// 通用设置
- 主题选择
- 通知开关
- 自动下载开关
```

---

## 🚀 扩展配置

### 添加新配置项

```javascript
// 在 appConfig 中添加
export const appConfig = {
  // ... 现有配置
  
  // 新功能配置
  newFeature: {
    enable: true,
    option1: 'value',
    option2: false,
  }
}
```

### 在组件中使用

```typescript
import { getConfig, setConfig } from '@/config/appConfig'

// 获取新配置
const isEnabled = getConfig('newFeature.enable')

// 修改新配置
setConfig('newFeature.enable', false)
```

---

## 💾 配置持久化

配置通过 **AsyncStorage** 持久化：

```typescript
// SettingScreen 中自动保存
await AsyncStorage.setItem('APP_SETTINGS', JSON.stringify(settings))

// 应用启动时自动加载
const stored = await AsyncStorage.getItem('APP_SETTINGS')
if (stored) {
  setSettings(JSON.parse(stored))
}
```

---

## 🔐 安全性

- ✅ 敏感信息不存储在配置文件中
- ✅ 支持环境变量覆盖
- ✅ 配置修改需要用户确认
- ✅ 支持恢复默认配置

---

## 📋 配置检查清单

- [ ] 所有必需的配置项都已定义
- [ ] 配置值类型正确
- [ ] 默认值合理
- [ ] 文档注释完整
- [ ] 工具函数可用
- [ ] 持久化正常工作
- [ ] 扩展便捷

---

## 🎯 最佳实践

1. **使用工具函数而不是直接访问**
   ```typescript
   // ✅ 好
   getConfig('player.volume')
   
   // ❌ 不好
   appConfig.player.volume
   ```

2. **提供默认值**
   ```typescript
   const value = getConfig('path.to.config', defaultValue)
   ```

3. **批量修改时使用 mergeConfig**
   ```typescript
   mergeConfig({ /* 配置对象 */ })
   ```

4. **配置修改后保存到存储**
   ```typescript
   setConfig('player.volume', 0.8)
   // 在 SettingScreen 中自动处理
   ```

---

## 📝 示例代码

### 完整示例：改变播放质量

```typescript
import { getConfig, setConfig } from '@/config/appConfig'

// 1. 获取当前质量
const currentQuality = getConfig('player.playQuality', '128k')

// 2. 修改质量
const newQuality = '320k'
setConfig('player.playQuality', newQuality)

// 3. 保存到 AsyncStorage（在 SettingScreen 中自动做）
const settings = {
  playQuality: newQuality,
  // ... 其他设置
}
await AsyncStorage.setItem('APP_SETTINGS', JSON.stringify(settings))

// 4. 应用新配置
applyMusicQuality(newQuality)
```

---

## 🔄 配置流程图

```
用户修改设置
    ↓
SettingScreen 获取变更
    ↓
setConfig() 更新内存配置
    ↓
AsyncStorage.setItem() 持久化
    ↓
组件监听配置变化
    ↓
应用新配置到功能模块
```

---

## 📞 常见问题

### Q: 配置修改后需要重启应用吗？
A: 不需要。配置会立即应用于相关功能模块。

### Q: 如何恢复默认配置？
A: 在设置页面点击"恢复默认设置"按钮。

### Q: 支持动态添加配置项吗？
A: 支持。使用 `setConfig()` 可以动态添加新的配置项。

### Q: 配置数据存储在哪里？
A: 存储在设备的 AsyncStorage 中（本地数据库）。

---

*配置文档完成时间: 2024年10月19日*  
*状态: ✅ 完整实现*  
*集成状态: ✅ 已集成到 SettingScreen*
