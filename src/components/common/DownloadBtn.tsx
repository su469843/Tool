import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { downloadQueue } from '@/core/download'
import { toast } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'

interface Props {
  musicInfo: LX.Music.MusicInfo
}

export default ({ musicInfo }: Props) => {
  const theme = useTheme()

  const handlePress = () => {
    downloadQueue.addTask(musicInfo)
    toast('已添加到下载队列')
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme['c-primary'] }]}
      onPress={handlePress}
    >
      <Text style={styles.text}>下载</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  text: {
    color: 'white',
    fontSize: 14
  }
})
