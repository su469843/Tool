import { getMusicUrl } from '../music/online'
import { downloadFile } from '@/utils/fs'
import { throttle } from '@/utils/common'
import { LIST_IDS } from '@/config/constant'

export type DownloadMusicInfo = {
  musicInfo: LX.Music.MusicInfoOnline
  quality: LX.Quality
  ext: 'mp3' | 'flac'
  filePath: string
}

interface DownloadTask {
  musicInfo: DownloadMusicInfo
  status: 'pending' | 'downloading' | 'completed' | 'error'
  progress: {
    downloaded: number
    total: number
    progress: number
    speed: string
  }
  statusText: string
  error?: Error
  cancel?: () => void
}

const downloadingTasks = new Map<string, DownloadTask>()

const updateProgress = throttle((musicInfo: DownloadMusicInfo, downloaded: number, total: number) => {
  const task = downloadingTasks.get(musicInfo.musicInfo.id)
  if (!task) return
  task.progress = {
    downloaded,
    total,
    progress: Math.floor(downloaded / total * 100),
    speed: `${Math.floor(downloaded / 1024)}KB/s`,
  }
}, 1000)

const startTask = async(downloadInfo: DownloadMusicInfo) => {
  const task: DownloadTask = {
    musicInfo: downloadInfo,
    status: 'pending',
    progress: {
      downloaded: 0,
      total: 0,
      progress: 0,
      speed: '0KB/s',
    },
    statusText: '准备下载...',
  }
  downloadingTasks.set(downloadInfo.musicInfo.id, task)

  try {
    task.status = 'downloading'
    task.statusText = '获取歌曲信息...'
    const url = await getMusicUrl({
      musicInfo: downloadInfo.musicInfo,
      quality: downloadInfo.quality,
      isRefresh: true,
      allowToggleSource: false,
    })

    const { jobId, promise } = downloadFile(url, downloadInfo.filePath, {
      progressInterval: 1000,
      begin({ contentLength }) {
        task.progress.total = contentLength
        updateProgress(downloadInfo, 0, contentLength)
      },
      progress({ bytesWritten }) {
        updateProgress(downloadInfo, bytesWritten, task.progress.total)
      },
    })

    task.cancel = () => {
      downloadingTasks.delete(downloadInfo.musicInfo.id)
    }

    await promise

    task.status = 'completed'
    task.statusText = '下载完成'
    downloadingTasks.delete(downloadInfo.musicInfo.id)
  } catch (err) {
    task.status = 'error'
    task.statusText = err.message
    task.error = err
    downloadingTasks.delete(downloadInfo.musicInfo.id)
    throw err
  }
}

export const downloadMusic = (downloadInfo: DownloadMusicInfo): Promise<void> => {
  if (downloadingTasks.has(downloadInfo.musicInfo.id)) {
    return Promise.reject(new Error('该歌曲已在下载中'))
  }

  return startTask(downloadInfo)
}

export const getDownloadingTask = (musicId: string) => {
  return downloadingTasks.get(musicId)
}

export const cancelDownload = (musicId: string) => {
  const task = downloadingTasks.get(musicId)
  if (!task) return
  task.cancel?.()
}

export const getAllDownloadingTask = () => {
  return Array.from(downloadingTasks.values())
}

/**
 * 检查列表内歌曲是否存在
 */
export const getLocalFilePath = async(musicInfo: LX.Music.MusicInfo): Promise<string | null> => {
  if (musicInfo.source == 'local' || !musicInfo.id) return null
  // return await getDownloadedFilePath(musicInfo)
  return null
}
