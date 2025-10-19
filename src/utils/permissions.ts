import { PermissionsAndroid, Platform } from 'react-native'
import { toast } from '@/utils/tools'

export const requestStoragePermission = async() => {
  if (Platform.OS !== 'android') return true

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "LX Music 需要存储权限",
        message: "下载音乐需要访问您的存储空间",
        buttonNeutral: "稍后询问",
        buttonNegative: "取消",
        buttonPositive: "确定",
      },
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    } else {
      toast('存储权限被拒绝')
      return false
    }
  } catch (err) {
    console.warn(err)
    toast('请求权限出错')
    return false
  }
}

export const createDownloadDir = async(path: string) => {
  if (Platform.OS !== 'android') return true
  
  try {
    // Implement directory creation logic here
    return true
  } catch (err) {
    console.warn(err)
    toast('创建下载目录失败')
    return false
  }
}
