import { getLyricInfo, getMusicUrl } from './music'
import { saveLyric, saveMusicUrl } from '@/utils/data'
import { downloadFile } from '@/utils/download'
import { getMusicFilePath } from '@/utils/music'
import settingState from '@/store/setting/state'

export interface DownloadMusicInfo extends LX.Music.MusicInfo {
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
  statusText: string
}

class DownloadQueue {
  private queue: DownloadMusicInfo[] = []
  private downloading: boolean = false

  addTask(musicInfo: LX.Music.MusicInfo) {
    const downloadInfo: DownloadMusicInfo = {
      ...musicInfo,
      progress: 0,
      status: 'pending',
      statusText: '等待下载...'
    }
    this.queue.push(downloadInfo)
    if (!this.downloading) this.startDownload()
  }

  private async startDownload() {
    if (this.queue.length === 0) return
    this.downloading = true

    const musicInfo = this.queue[0]
    musicInfo.status = 'downloading'
    musicInfo.statusText = '获取歌曲信息...'

    try {
      const url = await getMusicUrl({
        musicInfo,
        isRefresh: false,
        quality: settingState.setting['download.quality']
      })

      // Download file
      const filePath = await getMusicFilePath(musicInfo, settingState.setting['download.savePath'])
      musicInfo.statusText = '下载中...'

      await downloadFile(url, filePath, (progress) => {
        musicInfo.progress = progress
      })

      // Get and save lyrics
      musicInfo.statusText = '获取歌词...'
      const lyricInfo = await getLyricInfo(musicInfo)
      if (lyricInfo) {
        await saveLyric(musicInfo, lyricInfo)
      }

      musicInfo.status = 'completed'  
      musicInfo.statusText = '下载完成'

    } catch (err: any) {
      musicInfo.status = 'error'
      musicInfo.statusText = '下载失败: ' + err.message
    }

    // Remove completed task and start next
    this.queue.shift()
    this.downloading = false
    this.startDownload()
  }
}

export const downloadQueue = new DownloadQueue()
