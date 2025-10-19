import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { videoAPI } from './api'

interface Video {
  id: string | number
  title: string
  poster: string
  source: string
  source_name: string
  episodes: string[]
  year?: string
  description?: string
  resolution?: string
}

interface PlaySource {
  source: string
  source_name: string
  episodes: string[]
  resolution: string
}

const PLAY_RECORDS_KEY = 'VIDEO_PLAY_RECORDS'
const SEARCH_HISTORY_KEY = 'VIDEO_SEARCH_HISTORY'

const VideoScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState(0)
  const [progress, setProgress] = useState(0)
  const [playRecords, setPlayRecords] = useState<Record<string, any>>({})
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadPlayRecords()
    loadSearchHistory()
  }, [])

  // 加载播放记录
  const loadPlayRecords = async() => {
    try {
      const records = await AsyncStorage.getItem(PLAY_RECORDS_KEY)
      if (records) {
        setPlayRecords(JSON.parse(records))
      }
    } catch (error) {
      console.warn('加载播放记录失败:', error)
    }
  }

  // 加载搜索历史
  const loadSearchHistory = async() => {
    try {
      const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY)
      if (history) {
        setSearchHistory(JSON.parse(history))
      }
    } catch (error) {
      console.warn('加载搜索历史失败:', error)
    }
  }

  // 搜索视频
  const handleSearch = async(query: string) => {
    if (!query.trim()) {
      Alert.alert('提示', '请输入搜索关键词')
      return
    }

    setIsLoading(true)
    try {
      // 调用 API 搜索
      const results = await videoAPI.searchVideos(query)

      if (results.length === 0) {
        Alert.alert('提示', '未找到相关视频')
        setVideos([])
      } else {
        // 并行获取分辨率
        const videosWithResolution = await Promise.all(
          results.map(async(result: any) => ({
            id: result.id,
            title: result.title,
            poster: result.poster,
            source: result.source,
            source_name: result.source_name,
            episodes: result.episodes || [],
            year: result.year,
            description: result.desc,
            resolution: await videoAPI.getResolutionFromM3U8(result.episodes?.[0] || ''),
          })),
        )
        setVideos(videosWithResolution)
      }

      // 保存搜索历史
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      setSearchQuery('')
      setShowSearchHistory(false)
    } catch (error) {
      Alert.alert('错误', '搜索失败，请重试')
      console.warn('搜索错误:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 选择视频
  const handleSelectVideo = async(video: Video) => {
    setSelectedVideo(video)

    // 检查是否有播放记录
    const recordKey = `${video.source}_${video.id}`
    if (playRecords[recordKey]) {
      const record = playRecords[recordKey]
      setCurrentEpisode(record.index || 0)
      setProgress((record.play_time || 0) / (record.total_time || 1))
    } else {
      setCurrentEpisode(0)
      setProgress(0)
    }
  }

  // 播放视频
  const handlePlay = async() => {
    if (!selectedVideo) return

    setIsPlaying(true)

    // 模拟播放
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval)
          // 更新到下一集或结束
          if (currentEpisode < selectedVideo.episodes.length - 1) {
            handleNextEpisode()
          } else {
            setIsPlaying(false)
          }
          return 1
        }
        return prev + 0.001
      })
    }, 100)

    // 保存播放记录
    const recordKey = `${selectedVideo.source}_${selectedVideo.id}`
    const playTime = Math.floor(progress * 3600) // 假设每个视频1小时
    const newRecord = {
      title: selectedVideo.title,
      source_name: selectedVideo.source_name,
      cover: selectedVideo.poster,
      index: currentEpisode,
      total_episodes: selectedVideo.episodes.length,
      play_time: playTime,
      total_time: 3600,
      year: selectedVideo.year,
      save_time: Date.now(),
    }

    const newRecords = { ...playRecords, [recordKey]: newRecord }
    setPlayRecords(newRecords)
    await AsyncStorage.setItem(PLAY_RECORDS_KEY, JSON.stringify(newRecords))
  }

  // 下一集
  const handleNextEpisode = () => {
    if (selectedVideo && currentEpisode < selectedVideo.episodes.length - 1) {
      setCurrentEpisode(currentEpisode + 1)
      setProgress(0)
      setIsPlaying(false)
    }
  }

  // 上一集
  const handlePreviousEpisode = () => {
    if (currentEpisode > 0) {
      setCurrentEpisode(currentEpisode - 1)
      setProgress(0)
      setIsPlaying(false)
    }
  }

  // 下拉刷新
  const handleRefresh = async() => {
    setRefreshing(true)
    try {
      if (searchQuery) {
        await handleSearch(searchQuery)
      }
    } finally {
      setRefreshing(false)
    }
  }

  // 渲染视频卡片
  const renderVideoCard = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handleSelectVideo(item)}
    >
      <View style={styles.posterContainer}>
        <View style={styles.posterPlaceholder}>
          <Icon name="play-circle" size={48} color="#fff" />
        </View>
        <Text style={styles.resolution}>{item.resolution}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.source}>{item.source_name}</Text>
        <Text style={styles.year}>{item.year || '未知年份'}</Text>
      </View>
    </TouchableOpacity>
  )

  // 渲染播放器
  const renderPlayer = () => {
    if (!selectedVideo) return null

    const currentUrl = selectedVideo.episodes[currentEpisode] || ''

    return (
      <View style={[styles.playerContainer, isFullscreen && styles.playerFullscreen]}>
        <View style={styles.videoPlaceholder}>
          <Icon name="video-outline" size={80} color="#999" />
          <Text style={styles.videoLoadingText}>正在播放第 {currentEpisode + 1} 集</Text>
          <Text style={styles.videoUrl} numberOfLines={1}>
            {currentUrl}
          </Text>
        </View>

        {/* 大播放按钮 */}
        {!isPlaying && (
          <TouchableOpacity style={styles.largePlayButton} onPress={handlePlay}>
            <Icon name="play" size={64} color="#fff" />
          </TouchableOpacity>
        )}

        {/* 进度条 */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* 控制栏 */}
        <View style={styles.controlBar}>
          <TouchableOpacity onPress={handlePreviousEpisode} style={styles.controlButton}>
            <Icon name="skip-previous" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlay} style={styles.controlButton}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextEpisode} style={styles.controlButton}>
            <Icon name="skip-next" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.timeText}>
            集数: {currentEpisode + 1}/{selectedVideo.episodes.length}
          </Text>

          <TouchableOpacity onPress={() => setIsFullscreen(!isFullscreen)} style={styles.controlButton}>
            <Icon
              name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* 集数选择 */}
        <View style={styles.episodeListContainer}>
          <Text style={styles.episodeListTitle}>选择集数</Text>
          <FlatList
            data={selectedVideo.episodes}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.episodeButton,
                  currentEpisode === index && styles.episodeButtonActive,
                ]}
                onPress={() => {
                  setCurrentEpisode(index)
                  setProgress(0)
                  setIsPlaying(false)
                }}
              >
                <Text
                  style={[
                    styles.episodeButtonText,
                    currentEpisode === index && styles.episodeButtonTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    )
  }

  // 主界面
  if (!selectedVideo) {
    return (
      <View style={styles.container}>
        {/* 标题栏 */}
        <View style={styles.header}>
          <Text style={styles.title}>影视剧库</Text>
        </View>

        {/* 搜索栏 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索电影、电视剧..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowSearchHistory(true)}
          />
          <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
            <Icon name="magnify" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* 搜索历史 */}
        {showSearchHistory && searchHistory.length > 0 && !videos.length && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>搜索历史</Text>
              <TouchableOpacity
                onPress={async() => {
                  setSearchHistory([])
                  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY)
                }}
              >
                <Icon name="delete" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            <View style={styles.historyList}>
              {searchHistory.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => {
                    setSearchQuery(item)
                    handleSearch(item)
                  }}
                >
                  <Icon name="history" size={16} color="#666" />
                  <Text style={styles.historyItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 视频列表或加载状态 */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>搜索中...</Text>
          </View>
        ) : videos.length > 0 ? (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVideoCard}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="magnify" size={60} color="#CCC" />
            <Text style={styles.emptyText}>搜索电影或电视剧</Text>
          </View>
        )}
      </View>
    )
  }

  // 播放页面
  if (isFullscreen) {
    return (
      <View style={styles.fullscreenContainer}>
        {renderPlayer()}
        <TouchableOpacity
          style={styles.fullscreenCloseButton}
          onPress={() => setIsFullscreen(false)}
        >
          <Icon name="close" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedVideo(null)}>
          <Icon name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {selectedVideo.title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 播放器 */}
        {renderPlayer()}

        {/* 视频信息 */}
        <View style={styles.videoInfo}>
          <Text style={styles.infoTitle}>{selectedVideo.title}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>源:</Text>
            <Text style={styles.infoValue}>{selectedVideo.source_name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年份:</Text>
            <Text style={styles.infoValue}>{selectedVideo.year || '未知'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>分辨率:</Text>
            <Text style={styles.infoValue}>{selectedVideo.resolution}</Text>
          </View>
          {selectedVideo.description && (
            <Text style={styles.description}>{selectedVideo.description}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 12,
  },
  historyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  historyItemText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  listContent: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  videoCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  posterContainer: {
    position: 'relative',
    backgroundColor: '#000',
    height: 140,
  },
  posterPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  resolution: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  cardInfo: {
    padding: 10,
  },
  source: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  year: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  playerContainer: {
    width: '100%',
    backgroundColor: '#000',
    height: 250,
  },
  playerFullscreen: {
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  videoLoadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  videoUrl: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
    maxWidth: '90%',
  },
  largePlayButton: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlButton: {
    padding: 8,
  },
  timeText: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
  },
  episodeListContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  episodeListTitle: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  episodeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 8,
  },
  episodeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  episodeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  episodeButtonTextActive: {
    fontWeight: '600',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  videoInfo: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginTop: 12,
  },
})

export default VideoScreen
