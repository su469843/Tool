/**
 * Tool 应用配置文件
 * 支持内置配置和自定义扩展
 * 使用 JS 语法以便灵活配置
 */

export const appConfig = {
  // 应用基本信息
  app: {
    name: 'Tool',
    version: '1.7.2',
    versionCode: 72,
    package: 'io.qzz.hightime.tool',
  },

  // 播放设置
  player: {
    // 默认播放质量
    playQuality: '128k', // 128k, 192k, 320k, flac, wav
    
    // 播放模式
    togglePlayMethod: 'listLoop', // listLoop, listOnce, songLoop, random
    
    // 音量（0-1）
    volume: 1,
    
    // 播放速度
    playbackRate: 1,
    
    // 缓存大小（MB）
    cacheSize: 1024,
    
    // 是否保存播放时间
    isSavePlayTime: false,
    
    // 是否启用音频焦点处理
    isHandleAudioFocus: true,
    
    // 是否启用音频卸载
    isEnableAudioOffload: true,
    
    // 是否显示歌词翻译
    isShowLyricTranslation: false,
    
    // 是否显示歌词罗马音
    isShowLyricRoma: false,
    
    // 是否显示通知图片
    isShowNotificationImage: true,
    
    // 是否简体转繁体
    isS2t: false,
    
    // 是否显示蓝牙歌词
    isShowBluetoothLyric: false,
    
    // 启动时自动播放
    startupAutoPlay: false,
    
    // 启动时推送播放详情页
    startupPushPlayDetailScreen: false,
    
    // 是否自动清理已播放列表
    isAutoCleanPlayedList: false,
  },

  // 搜索设置
  search: {
    // 是否显示热搜
    isShowHotSearch: false,
    
    // 是否显示搜索历史
    isShowHistorySearch: false,
  },

  // 列表设置
  list: {
    // 点击歌单是否播放
    isClickPlayList: false,
    
    // 是否显示源
    isShowSource: true,
    
    // 是否显示专辑名
    isShowAlbumName: false,
    
    // 是否显示歌曲间隔
    isShowInterval: true,
    
    // 是否保存列表滚动位置
    isSaveScrollLocation: true,
    
    // 添加音乐位置类型
    addMusicLocationType: 'top', // top, bottom
  },

  // 下载设置
  download: {
    // 下载文件名格式
    fileName: '歌名 - 歌手',
    
    // 下载质量
    quality: '320k',
    
    // 自动下载
    autoDownload: false,
  },

  // 主题设置
  theme: {
    // 主题 ID
    id: 'green',
    
    // 浅色主题 ID
    lightId: 'green',
    
    // 深色主题 ID
    darkId: 'black',
    
    // 是否隐藏深色背景
    hideBgDark: false,
    
    // 是否启用动态背景
    dynamicBg: false,
    
    // 是否启用字体阴影
    fontShadow: false,
  },

  // 通用设置
  common: {
    // 是否自动切换主题
    isAutoTheme: false,
    
    // 语言 ID
    langId: null,
    
    // API 源
    apiSource: '',
    
    // 源名称类型
    sourceNameType: 'alias', // alias, name
    
    // 分享类型
    shareType: 'system',
    
    // 是否同意协议
    isAgreePact: false,
    
    // 是否自动隐藏播放条
    autoHidePlayBar: true,
    
    // 抽屉布局位置
    drawerLayoutPosition: 'left', // left, right
    
    // 首页是否可滚动
    homePageScroll: true,
    
    // 是否显示返回按钮
    showBackBtn: false,
    
    // 是否显示退出按钮
    showExitBtn: true,
    
    // 是否使用系统文件选择器
    useSystemFileSelector: true,
    
    // 是否始终保持状态栏高度
    alwaysKeepStatusbarHeight: false,
  },

  // 音乐源配置
  musicSources: [
    {
      id: 'netease',
      name: '网易云音乐',
      enabled: true,
      priority: 1,
    },
    {
      id: 'qq',
      name: 'QQ 音乐',
      enabled: true,
      priority: 2,
    },
    {
      id: 'kugou',
      name: '酷狗音乐',
      enabled: true,
      priority: 3,
    },
    {
      id: 'kuwo',
      name: '酷我音乐',
      enabled: true,
      priority: 4,
    },
    {
      id: 'migu',
      name: '咪咕音乐',
      enabled: true,
      priority: 5,
    },
    {
      id: 'bilibili',
      name: '哔哩哔哩',
      enabled: false,
      priority: 6,
    },
  ],

  // 视频源配置
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
    {
      id: 'tencent',
      name: '腾讯视频',
      enabled: true,
      priority: 3,
    },
    {
      id: 'bilibili',
      name: '哔哩哔哩',
      enabled: true,
      priority: 4,
    },
  ],

  // 快捷键配置
  shortcuts: {
    playPause: 'space',
    nextTrack: 'right',
    previousTrack: 'left',
    volumeUp: 'up',
    volumeDown: 'down',
  },

  // 功能开关
  features: {
    // 转盘抽奖
    wheel: true,
    // AI 对话
    aiChat: true,
    // 视频播放
    video: true,
    // 音乐播放
    music: true,
    // 文件编辑
    fileEditor: true,
    // 天气查询
    weather: true,
    // 设置页面
    settings: true,
  },

  // API 配置
  api: {
    // 默认超时时间（毫秒）
    timeout: 30000,
    
    // 重试次数
    retryCount: 3,
    
    // 重试延迟（毫秒）
    retryDelay: 1000,
    
    // 缓存时间（毫秒）
    cacheTime: 5 * 60 * 1000, // 5分钟
  },

  // 同步配置
  sync: {
    // 是否启用同步
    enable: false,
    
    // 同步间隔（分钟）
    interval: 60,
    
    // 同步服务器地址
    serverUrl: '',
  },

  // 桌面歌词配置
  desktopLyric: {
    // 是否启用
    enable: false,
    
    // 是否锁定
    isLock: false,
    
    // 宽度（百分比）
    width: 100,
    
    // 最大行数
    maxLineNum: 5,
    
    // 是否单行显示
    isSingleLine: false,
    
    // 是否显示切换动画
    showToggleAnima: true,
    
    // 位置
    position: {
      x: 0,
      y: 0,
    },
    
    // 文字位置
    textPosition: {
      x: 'left',
      y: 'top',
    },
    
    // 样式
    style: {
      fontSize: 180,
      opacity: 100,
      lyricUnplayColor: 'rgba(255, 255, 255, 1)',
      lyricPlayedColor: 'rgba(7, 197, 86, 1)',
      lyricShadowColor: 'rgba(0, 0, 0, 0.6)',
    },
  },

  // 通知配置
  notification: {
    // 是否启用
    enable: true,
    
    // 是否显示进度条
    showProgress: true,
    
    // 是否显示专辑图
    showAlbumImage: true,
  },

  // 日志配置
  logging: {
    // 是否启用日志
    enable: true,
    
    // 日志级别
    level: 'info', // error, warn, info, debug
    
    // 是否保存日志文件
    saveToFile: false,
    
    // 日志文件路径
    filePath: '/documents/logs/',
  },

  // 高级设置
  advanced: {
    // 启用调试模式
    debugMode: false,
    
    // 启用开发者选项
    developerOptions: false,
    
    // 启用详细日志
    verboseLogging: false,
  },
}

/**
 * 获取配置值
 * @param {string} path - 配置路径，支持点符号，如 'player.volume'
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值
 */
export function getConfig(path, defaultValue = undefined) {
  const keys = path.split('.')
  let value = appConfig

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return defaultValue
    }
  }

  return value
}

/**
 * 设置配置值
 * @param {string} path - 配置路径
 * @param {*} value - 新值
 */
export function setConfig(path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  let obj = appConfig

  for (const key of keys) {
    if (!(key in obj) || typeof obj[key] !== 'object') {
      obj[key] = {}
    }
    obj = obj[key]
  }

  if (lastKey) {
    obj[lastKey] = value
  }
}

/**
 * 合并配置
 * @param {object} customConfig - 自定义配置
 */
export function mergeConfig(customConfig) {
  Object.assign(appConfig, customConfig)
}

export default appConfig
