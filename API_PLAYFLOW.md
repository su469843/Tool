# OrionTV 电视播放流程 & API 接口详解

## 核心流程
搜索 → 获取结果 → 选择详情 → 选择源 → 选择集数 → 播放视频

## API 接口

### 搜索
- searchVideos(query) - 全局搜索
- searchVideo(query, resourceId) - 单源搜索

### 详情
- getVideoDetail(source, id) - 获取完整信息

### 源管理
- getResources() - 获取所有播放源
- getDoubanData(type, tag) - 获取豆瓣数据

### 收藏
- getFavorites() - 获取收藏
- addFavorite(key, favorite) - 添加收藏
- deleteFavorite(key) - 删除收藏

### 播放记录
- getPlayRecords() - 获取历史
- savePlayRecord(key, record) - 保存进度
- deletePlayRecord(key) - 删除记录

### 搜索历史
- getSearchHistory() - 获取历史
- addSearchHistory(keyword) - 添加历史
- deleteSearchHistory(keyword) - 删除历史

### 其他
- getServerConfig() - 获取服务器配置
- login(username, password) - 用户登录
- logout() - 用户登出
- getImageProxyUrl(url) - 获取图片代理

## 完整示例

1. 搜索: const results = await api.searchVideos("权力的游戏")
2. 选择源: const selected = results[0]
3. 获取URL: const url = selected.episodes[0]
4. 播放: <Video source={{ uri: url }} />
5. 保存进度: await api.savePlayRecord("key", record)
