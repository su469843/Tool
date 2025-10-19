import { version } from '../../package.json'

export const UPDATE_URLS = {
  // 版本信息
  VERSION_INFO: [
    'https://raw.githubusercontent.com/lyswhut/lx-music-mobile/master/publish/version.json',
    'https://registry.npmjs.org/lx-music-mobile-version-info/latest',
    'https://cdn.jsdelivr.net/gh/lyswhut/lx-music-mobile/publish/version.json', 
    'https://fastly.jsdelivr.net/gh/lyswhut/lx-music-mobile/publish/version.json',
    'https://gcore.jsdelivr.net/gh/lyswhut/lx-music-mobile/publish/version.json',
    // 添加国内镜像
    'https://gitee.com/lyswhut/lx-music-mobile/raw/master/publish/version.json',
  ],
  
  // APK下载
  DOWNLOAD_APK: [
    'https://github.com/lyswhut/lx-music-mobile/releases/download/v{version}/{filename}',
    // 添加镜像
    'https://download.fastgit.org/lyswhut/lx-music-mobile/releases/download/v{version}/{filename}',
    'https://hub.fastgit.xyz/lyswhut/lx-music-mobile/releases/download/v{version}/{filename}'
  ]
}

export const RETRY_TIMES = 3
export const RETRY_DELAY = 1000
export const TIMEOUT = 10000

export default {
  version,
  UPDATE_URLS,
  RETRY_TIMES,
  RETRY_DELAY,
  TIMEOUT
}
