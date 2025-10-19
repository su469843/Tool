// 影视播放 API 服务
// 基于 API_PLAYFLOW.md 实现

interface SearchResult {
  id: number
  title: string
  poster: string
  episodes: string[]
  source: string
  source_name: string
  year?: string
  desc?: string
  type_name?: string
}

interface ApiResource {
  key: string
  name: string
  api: string
}

interface PlayRecord {
  title: string
  source_name: string
  cover: string
  index: number
  total_episodes: number
  play_time: number
  total_time: number
  year?: string
  save_time?: number
}

// 模拟 API 服务
export class VideoAPI {
  private baseURL: string = 'https://api.example.com'
  private searchCache: Map<string, SearchResult[]> = new Map()
  private cacheDuration: number = 5 * 60 * 1000 // 5分钟

  setBaseUrl(url: string) {
    this.baseURL = url
  }

  // 1. 搜索视频 - 全局搜索
  async searchVideos(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
    // 检查缓存
    if (this.searchCache.has(query)) {
      return this.searchCache.get(query) || []
    }

    try {
      const response = await fetch(`${this.baseURL}/api/search?q=${encodeURIComponent(query)}`, {
        signal,
      })
      const data = await response.json()
      const results: SearchResult[] = data.results || []

      // 缓存结果
      this.searchCache.set(query, results)
      setTimeout(() => {
        this.searchCache.delete(query)
      }, this.cacheDuration)

      return results
    } catch (error) {
      console.warn('搜索失败:', error)
      return []
    }
  }

  // 2. 搜索视频 - 单源搜索
  async searchVideo(
    query: string,
    resourceId: string,
    signal?: AbortSignal,
  ): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/search/one?q=${encodeURIComponent(query)}&resourceId=${resourceId}`,
        { signal },
      )
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.warn('单源搜索失败:', error)
      return []
    }
  }

  // 3. 获取所有播放源
  async getResources(): Promise<ApiResource[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/search/resources`)
      const data = await response.json()
      return data || []
    } catch (error) {
      console.warn('获取源失败:', error)
      return [
        {
          key: 'youku',
          name: '优酷',
          api: 'https://youku.com/api',
        },
        {
          key: 'iqiyi',
          name: '爱奇艺',
          api: 'https://iqiyi.com/api',
        },
      ]
    }
  }

  // 4. 获取视频详情
  async getVideoDetail(source: string, id: string): Promise<SearchResult | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/detail?source=${source}&id=${id}`,
      )
      const data = await response.json()
      return data || null
    } catch (error) {
      console.warn('获取详情失败:', error)
      return null
    }
  }

  // 5. 获取M3U8分辨率
  async getResolutionFromM3U8(m3u8Url: string): Promise<string> {
    try {
      const response = await fetch(m3u8Url)
      const text = await response.text()

      if (text.includes('1920x1080') || text.includes('1080')) {
        return '1080p'
      } else if (text.includes('1280x720') || text.includes('720')) {
        return '720p'
      } else if (text.includes('854x480') || text.includes('480')) {
        return '480p'
      }
      return '标清'
    } catch (error) {
      return '未知'
    }
  }

  // 6. 保存播放记录
  async savePlayRecord(key: string, record: PlayRecord): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/play-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          ...record,
          save_time: Date.now(),
        }),
      })
      return response.ok
    } catch (error) {
      console.warn('保存播放记录失败:', error)
      return false
    }
  }

  // 7. 获取播放记录
  async getPlayRecords(): Promise<Record<string, PlayRecord>> {
    try {
      const response = await fetch(`${this.baseURL}/api/play-records`)
      const data = await response.json()
      return data || {}
    } catch (error) {
      console.warn('获取播放记录失败:', error)
      return {}
    }
  }

  // 8. 获取搜索历史
  async getSearchHistory(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/search-history`)
      const data = await response.json()
      return data || []
    } catch (error) {
      return []
    }
  }

  // 9. 添加搜索历史
  async addSearchHistory(keyword: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/search-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // 10. 获取豆瓣数据
  async getDoubanData(
    type: 'movie' | 'tv',
    tag: string,
    pageSize: number = 16,
    pageStart: number = 0,
  ): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/douban?type=${type}&tag=${encodeURIComponent(tag)}&pageSize=${pageSize}&pageStart=${pageStart}`,
      )
      const data = await response.json()
      return data.list || []
    } catch (error) {
      console.warn('获取豆瓣数据失败:', error)
      return []
    }
  }

  // 11. 图片代理 URL
  getImageProxyUrl(imageUrl: string): string {
    return `${this.baseURL}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
  }
}

// 导出单例
export const videoAPI = new VideoAPI()
