import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { downloadQueue, type DownloadMusicInfo } from '@/core/download'
import { createStyle } from '@/utils/tools'

export default () => {
  const theme = useTheme()
  const [downloadList, setDownloadList] = useState<DownloadMusicInfo[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setDownloadList([...downloadQueue.getQueue()])
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const renderItem = ({ item }: { item: DownloadMusicInfo }) => (
    <View style={styles.listItem}>
      <View style={styles.musicInfo}>
        <Text style={[styles.musicName, { color: theme['c-primary'] }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.musicSinger, { color: theme['c-font'] }]} numberOfLines={1}>{item.singer}</Text>
      </View>
      <View style={styles.downloadInfo}>
        <Text style={[styles.statusText, { color: theme['c-font'] }]}>{item.statusText}</Text>
        {item.status === 'downloading' && (
          <Text style={[styles.progressText, { color: theme['c-primary'] }]}>
            {Math.floor(item.progress * 100)}%
          </Text>
        )}
      </View>
      {item.status === 'downloading' && (
        <View style={styles.progressBar}>
          <View style={[styles.progress, { 
            backgroundColor: theme['c-primary'],
            width: `${item.progress * 100}%`
          }]} />
        </View>
      )}
    </View>
  )

  return (
    <FlatList
      data={downloadList}
      renderItem={renderItem}
      keyExtractor={item => item.songmid}
      style={styles.container}
    />
  )  
}

const styles = createStyle({
  container: {
    flex: 1
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  musicInfo: {
    marginBottom: 8
  },
  musicName: {
    fontSize: 16,
    marginBottom: 4
  },
  musicSinger: {
    fontSize: 14
  },
  downloadInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  statusText: {
    fontSize: 12
  },
  progressText: {
    fontSize: 12
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 1
  },
  progress: {
    height: '100%',
    borderRadius: 1
  }
})
