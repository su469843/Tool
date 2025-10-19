import { httpGet } from '@/utils/request'
import { author, name } from '../../package.json'
import { downloadFile, stopDownload, temporaryDirectoryPath } from '@/utils/fs'
import { getSupportedAbis, installApk } from '@/utils/nativeModules/utils'
import { APP_PROVIDER_NAME } from '@/config/constant'

const abis = [
  'arm64-v8a',
  'armeabi-v7a',
  'x86_64',
  'x86',
  'universal',
]

import config from '@/config/update'
const { UPDATE_URLS, RETRY_TIMES, RETRY_DELAY, TIMEOUT } = config

const address = [
  ...UPDATE_URLS.VERSION_INFO.map(url => [url, 'direct']),
  ['https://registry.npmmirror.com/lx-music-mobile-version-info/latest', 'npm'],
  ['https://gitee.com/lyswhut/lx-music-mobile-versions/raw/master/version.json', 'direct'],
  ['http://cdn.stsky.cn/lx-music/mobile/version.json', 'direct'],
]


const request = async(url, retryNum = 0) => {
  return new Promise((resolve, reject) => {
    httpGet(url, {
      timeout: 10000,
    }, (err, resp, body) => {
      if (err || resp.statusCode != 200) {
        ++retryNum >= 3
          ? reject(err || new Error(resp.statusMessage || resp.statusCode))
          : request(url, retryNum).then(resolve).catch(reject)
      } else resolve(body)
    })
  })
}

const getDirectInfo = async(url) => {
  return request(url).then(info => {
    if (info.version == null) throw new Error('failed')
    return info
  })
}

const getNpmPkgInfo = async(url) => {
  return request(url).then(json => {
    if (!json.versionInfo) throw new Error('failed')
    const info = JSON.parse(json.versionInfo)
    if (info.version == null) throw new Error('failed')
    return info
  })
}

export const getVersionInfo = async(index = 0) => {
  const [url, source] = address[index]
  let promise
  switch (source) {
    case 'direct':
      promise = getDirectInfo(url)
      break
    case 'npm':
      promise = getNpmPkgInfo(url)
      break
  }

  return promise.catch(async(err) => {
    index++
    if (index >= address.length) throw err
    return getVersionInfo(index)
  })
}

const getTargetAbi = async() => {
  const supportedAbis = await getSupportedAbis()
  for (const abi of abis) {
    if (supportedAbis.includes(abi)) return abi
  }
  return abis[abis.length - 1]
}
let downloadJobId = null
const noop = (total, download) => {}
let apkSavePath

const downloadWithRetry = async(url, savePath, onDownload, retryCount = 0) => {
  try {
    const { jobId, promise } = downloadFile(url, savePath, {
      progressInterval: 500,
      connectionTimeout: TIMEOUT,
      readTimeout: TIMEOUT,
      begin({ statusCode, contentLength }) {
        onDownload(contentLength, 0)
      },
      progress({ contentLength, bytesWritten }) {
        onDownload(contentLength, bytesWritten)
      },
    })
    downloadJobId = jobId
    await promise
    return true
  } catch (err) {
    if (retryCount >= RETRY_TIMES) throw err
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    return downloadWithRetry(url, savePath, onDownload, retryCount + 1)
  }
}

export const downloadNewVersion = async(version, onDownload = noop) => {
  const abi = await getTargetAbi()
  const filename = `${name}-v${version}-${abi}.apk`
  let savePath = temporaryDirectoryPath + '/lx-music-mobile.apk'

  if (downloadJobId) stopDownload(downloadJobId)
  
  for (const urlTemplate of UPDATE_URLS.DOWNLOAD_APK) {
    try {
      const url = urlTemplate.replace('{version}', version).replace('{filename}', filename)
      await downloadWithRetry(url, savePath, onDownload)
      apkSavePath = savePath
      return updateApp()
    } catch (err) {
      console.log('Download failed:', err)
      continue
    }
  }
  throw new Error('All download attempts failed')
}

export const updateApp = async() => {
  if (!apkSavePath) throw new Error('apk Save Path is null')
  await installApk(apkSavePath, APP_PROVIDER_NAME)
}
