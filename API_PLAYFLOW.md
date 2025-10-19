# OrionTV 电视播放流程 & API 接口详解

## 📱 核心流程图

```
用户搜索 → 获取搜索结果 → 选择详情 → 选择源 → 选择集数 → 播放
   ↓          ↓           ↓        ↓       ↓       ↓
Search    DetailStore   PlayStore  Episodes UI    Video
```

---

## 🎬 详细流程步骤

### **第1步：搜索视频** (Search Screen)
- **路由**: `/search`
- **用户操作**: 输入搜索关键词

### **第2步：获取搜索结果** (detailStore.init)
调用 API 获取视频列表：

```typescript
// 方式1：搜索优先源（速度快）
const response = await api.searchVideo(query, preferredSource, signal);

// 方式2：搜索所有源（如果优先源失败）
const { results } = await api.searchVideos(query);

// 返回结果结构：SearchResult[]
SearchResult {
  id: number              // 视频ID
  title: string           // 视频标题
  poster: string          // 封面图URL
  episodes: string[]      // 所有集数的M3U8 URL
  source: string          // 源标识
  source_name: string     // 源名称（如"优酷"、"爱奇艺"）
  class?: string          // 分类
  year: string            // 发布年份
  desc?: string           // 描述
  type_name?: string      // 类型名称
}
```

### **第3步：获取视频详情** (Detail Screen)
- **路由**: `/detail?q={searchKeyword}&source={source}&id={id}`
- **展示内容**: 
  - 海报、标题、年份、类型、描述
  - 所有搜索到的播放源列表
  - 每个源的分辨率检测

**关键操作**：
```typescript
// 检测每个源的分辨率
const resolution = await getResolutionFromM3U8(episodes[0], signal);
// 返回: "1080p" | "720p" | "480p" 等
```

### **第4步：选择播放源** (Source Selection Modal)
用户从列表中选择喜欢的源：
```typescript
// 点击源后触发
await setDetail(selectedSource)  // 更新 detail store
```

### **第5步：选择集数** (Episode Selection Modal)
- **显示所有集数**: `detail.episodes[]`
- **当前集数**: `currentEpisodeIndex`
- **一键跳转**: 点击集数跳转播放

### **第6步：播放视频** (Play Screen)
- **路由**: `/play?source={source}&id={id}&episodeIndex={index}`
- **使用组件**: `<Video>` (expo-av)
- **视频URL**: `detail.episodes[episodeIndex]`

---

## 🔗 API 接口详细说明

### **1. 搜索接口**

#### `searchVideos(query: string)` - 全局搜索
```typescript
// 请求
GET /api/search?q={query}

// 响应
{
  results: SearchResult[]
}

// 示例
const { results } = await api.searchVideos("权力的游戏");
// results: 来自所有源的搜索结果
```

#### `searchVideo(query: string, resourceId: string)` - 单源搜索
```typescript
// 请求
GET /api/search/one?q={query}&resourceId={resourceId}

// 响应
{
  results: SearchResult[]  // 过滤后只返回标题匹配的结果
}

// 示例
const { results } = await api.searchVideo("权力的游戏", "youku");
// results: 只来自"youku"源的结果
```

---

### **2. 详情接口**

#### `getVideoDetail(source: string, id: string)` - 获取完整信息
```typescript
// 请求
GET /api/detail?source={source}&id={id}

// 响应
VideoDetail {
  id: string
  title: string
  poster: string
  source: string
  source_name: string
  desc?: string
  type?: string
  year?: string
  area?: string
  director?: string
  actor?: string
  remarks?: string
}

// 示例
const detail = await api.getVideoDetail("youku", "123456");
```

---

### **3. 源管理接口**

#### `getResources()` - 获取所有播放源
```typescript
// 请求
GET /api/search/resources

// 响应
ApiSite[] {
  key: string        // 源唯一标识（如 "youku"）
  api: string        // 源API地址
  name: string       // 源显示名称
  detail?: string    // 源描述
}

// 示例
const resources = await api.getResources();
// [
//   { key: "youku", api: "...", name: "优酷", detail: "..." },
//   { key: "iqiyi", api: "...", name: "爱奇艺", detail: "..." },
//   ...
// ]
```

---

### **4. 豆瓣数据接口**

#### `getDoubanData(type, tag, pageSize, pageStart)` - 获取豆瓣数据
```typescript
// 请求
GET /api/douban?type={type}&tag={tag}&pageSize={pageSize}&pageStart={pageStart}

// 参数
type: "movie" | "tv"
tag: string  // 标签（如 "热门", "top250", "国产剧" 等）
pageSize: number  // 每页数量（默认16）
pageStart: number // 起始位置（默认0）

// 响应
DoubanResponse {
  code: number
  message: string
  list: DoubanItem[]  // { title, poster, rate }
}

// 示例
const data = await api.getDoubanData("tv", "热门", 16, 0);
```

---

### **5. 收藏管理接口**

#### `getFavorites(key?: string)` - 获取收藏
```typescript
// 获取所有
const all = await api.getFavorites();
// { "key1": {...}, "key2": {...} }

// 获取单个
const one = await api.getFavorites("my-favorite-key");
// { cover, title, source_name, ... }
```

#### `addFavorite(key: string, favorite: Favorite)` - 添加收藏
```typescript
await api.addFavorite("my-key", {
  cover: "poster_url",
  title: "电视剧名称",
  source_name: "优酷",
  total_episodes: 24,
  search_title: "搜索时的标题",
  year: "2023"
});
```

#### `deleteFavorite(key?: string)` - 删除收藏
```typescript
// 删除单个
await api.deleteFavorite("my-key");

// 删除全部
await api.deleteFavorite();
```

---

### **6. 播放记录接口**

#### `getPlayRecords()` - 获取所有记录
```typescript
const records = await api.getPlayRecords();
// {
//   "video-key": {
//     title, source_name, cover, index, total_episodes,
//     play_time, total_time, save_time, year
//   }
// }
```

#### `savePlayRecord(key: string, record: PlayRecord)` - 保存进度
```typescript
await api.savePlayRecord("video-key", {
  title: "权力的游戏",
  source_name: "优酷",
  cover: "poster_url",
  index: 5,              // 当前集数
  total_episodes: 24,
  play_time: 2400,       // 播放到的秒数
  total_time: 3600,      // 总时长
  year: "2023"
});
```

---

### **7. 搜索历史接口**

#### `getSearchHistory()` - 获取历史
```typescript
const history = await api.getSearchHistory();
// ["权力的游戏", "权利的游戏", ...]
```

#### `addSearchHistory(keyword: string)` - 添加历史
```typescript
await api.addSearchHistory("权力的游戏");
```

#### `deleteSearchHistory(keyword?: string)` - 删除历史
```typescript
// 删除单个
await api.deleteSearchHistory("权力的游戏");

// 删除全部
await api.deleteSearchHistory();
```

---

### **8. 服务器配置接口**

#### `getServerConfig()` - 获取配置
```typescript
// 请求
GET /api/server-config

// 响应
ServerConfig {
  SiteName: string           // 服务器名称
  StorageType: "localstorage" | "redis" | string
}

// 用途：初始化应用时获取服务器信息
```

---

### **9. 认证接口**

#### `login(username?: string, password?: string)` - 登录
```typescript
const result = await api.login("admin", "password");
// { ok: true }
// Cookie 自动保存到 AsyncStorage
```

#### `logout()` - 登出
```typescript
await api.logout();
// { ok: true }
```

---

### **10. 代理接口**

#### `getImageProxyUrl(imageUrl: string)` - 获取代理URL
```typescript
const proxyUrl = api.getImageProxyUrl(originalImageUrl);
// 返回: "${baseURL}/api/image-proxy?url={encoded_url}"

// 用于解决CORS或防盗链问题
<Image source={{ uri: proxyUrl }} />
```

---

## 🔄 完整播放示例

```typescript
// 1. 初始化 API URL
const api = new API("https://api.example.com");

// 2. 搜索视频
const { results } = await api.searchVideos("权力的游戏");
// results: [SearchResult, SearchResult, ...]

// 3. 获取所有源
const resources = await api.getResources();
// 获取分辨率
const resultsWithResolution = await Promise.all(
  results.map(async (item) => ({
    ...item,
    resolution: await getResolutionFromM3U8(item.episodes[0])
  }))
);

// 4. 选择源和集数
const selectedResult = resultsWithResolution[0];  // 选择第一个源
const episodeIndex = 0;                           // 选择第一集

// 5. 获取视频 URL
const episodeUrl = selectedResult.episodes[episodeIndex];
// 示例: "https://oss.example.com/video/ep001.m3u8"

// 6. 播放视频
<Video
  source={{ uri: episodeUrl }}
  useNativeControls={true}
  resizeMode="contain"
  ref={videoRef}
/>

// 7. 保存播放进度
await api.savePlayRecord("my-key", {
  title: selectedResult.title,
  source_name: selectedResult.source_name,
  cover: selectedResult.poster,
  index: episodeIndex,
  total_episodes: selectedResult.episodes.length,
  play_time: currentTime,
  total_time: duration,
  year: selectedResult.year
});
```

---

## ⚙️ API 初始化配置

```typescript
// services/api.ts
export let api = new API();

// 在应用启动时设置 baseURL
api.setBaseUrl("https://api.example.com");

// 或通过 settingsStore 动态设置
useSettingsStore.getState().setApiBaseUrl("https://new-api.example.com");
```

---

## 📊 数据流向总结

```
┌─────────────────┐
│  Search Screen  │
└────────┬────────┘
         │ 输入关键词
         ↓
┌─────────────────┐
│  searchVideos() │ ← API 调用
│  searchVideo()  │   获取 SearchResult[]
└────────┬────────┘
         │
         ↓
┌──────────────────┐
│  Detail Screen   │ ← detailStore
│  (显示所有源)    │   解析分辨率
└────────┬─────────┘
         │ 用户选择源和集数
         ↓
┌──────────────────┐
│  Play Screen     │ ← playerStore
│  (播放视频)      │   记录进度
└──────────────────┘
```

---

## 🎯 关键点总结

| 操作 | API | 返回值 |
|------|-----|--------|
| 搜索视频 | `searchVideos()` | `SearchResult[]` |
| 获取源 | `getResources()` | `ApiSite[]` |
| 获取详情 | `getVideoDetail()` | `VideoDetail` |
| 获取集数 | 在 `SearchResult.episodes[]` | `string[]` (M3U8 URLs) |
| 播放链接 | `episodes[index]` | M3U8 URL |
| 保存进度 | `savePlayRecord()` | `{ success: true }` |

---

## 🚀 性能优化

1. **并行搜索**：先搜优先源，失败时立即搜所有源
2. **分辨率检测**：异步并行获取所有源的分辨率
3. **缓存**：Memory cache + 5分钟过期时间
4. **取消机制**：使用 `AbortController` 取消过期请求

