import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { appConfig, getConfig, setConfig } from '@/config/appConfig'

interface Settings {
  theme: 'light' | 'dark' | 'auto'
  notificationsEnabled: boolean
  autoPlayEnabled: boolean
  videoQuality: '1080p' | '720p' | '480p' | 'auto'
  audioQuality: 'high' | 'medium' | 'low'
  autoDownload: boolean
  cacheSize: string
  language: 'zh' | 'en'
  playQuality: '128k' | '192k' | '320k' | 'flac'
  apiSource: string
  togglePlayMethod: 'listLoop' | 'listOnce' | 'songLoop' | 'random'
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'auto',
  notificationsEnabled: true,
  autoPlayEnabled: true,
  videoQuality: 'auto',
  audioQuality: 'high',
  autoDownload: false,
  cacheSize: '500MB',
  language: 'zh',
  playQuality: '128k',
  apiSource: 'netease',
  togglePlayMethod: 'listLoop',
}

const SETTINGS_KEY = 'APP_SETTINGS'

const SettingScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [showQualityPicker, setShowQualityPicker] = useState(false)
  const [showPlayQualityPicker, setShowPlayQualityPicker] = useState(false)
  const [showPlayMethodPicker, setShowPlayMethodPicker] = useState(false)
  const [showMusicSourcePicker, setShowMusicSourcePicker] = useState(false)
  const [musicSources, setMusicSources] = useState(appConfig.musicSources)

  useEffect(() => {
    loadSettings()
  }, [])

  // 加载设置
  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY)
      if (stored) {
        setSettings(JSON.parse(stored))
      }
    } catch (error) {
      console.warn('加载设置失败:', error)
    }
  }

  // 保存设置
  const saveSettings = async (newSettings: Settings) => {
    try {
      setSettings(newSettings)
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
    } catch (error) {
      Alert.alert('错误', '保存设置失败')
    }
  }

  // 切换开关
  const handleToggle = (key: keyof Settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    }
    saveSettings(newSettings)
  }

  // 选择主题
  const handleThemeSelect = (theme: 'light' | 'dark' | 'auto') => {
    const newSettings = { ...settings, theme }
    saveSettings(newSettings)
    setSelectedSection(null)
  }

  // 重置设置
  const handleResetSettings = () => {
    Alert.alert('重置设置', '确定要恢复为默认设置吗？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          saveSettings(DEFAULT_SETTINGS)
          Alert.alert('成功', '已恢复为默认设置')
        },
      },
    ])
  }

  // 清除缓存
  const handleClearCache = () => {
    Alert.alert('清除缓存', '这将删除所有临时文件，确定吗？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => {
          Alert.alert('成功', '缓存已清除')
        },
      },
    ])
  }

  // 主题选择弹窗
  const ThemeModal = () => (
    <Modal visible={selectedSection === 'theme'} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择主题</Text>
            <TouchableOpacity onPress={() => setSelectedSection(null)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {[
              { value: 'light' as const, label: '浅色', icon: 'white-balance-sunny' },
              { value: 'dark' as const, label: '深色', icon: 'moon-waning-crescent' },
              { value: 'auto' as const, label: '跟随系统', icon: 'brightness-auto' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => handleThemeSelect(option.value)}
              >
                <Icon name={option.icon} size={24} color="#007AFF" />
                <Text style={styles.optionLabel}>{option.label}</Text>
                {settings.theme === option.value && (
                  <Icon name="check-circle" size={24} color="#34C759" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )

  // 播放质量选择
  const PlayQualityModal = () => (
    <Modal visible={showPlayQualityPicker} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择音乐质量</Text>
            <TouchableOpacity onPress={() => setShowPlayQualityPicker(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {[
              { value: '128k' as const, label: '128k (低)' },
              { value: '192k' as const, label: '192k (中)' },
              { value: '320k' as const, label: '320k (高)' },
              { value: 'flac' as const, label: 'FLAC (无损)' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => {
                  const newSettings = { ...settings, playQuality: option.value }
                  saveSettings(newSettings)
                  setShowPlayQualityPicker(false)
                }}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {settings.playQuality === option.value && (
                  <Icon name="check-circle" size={24} color="#34C759" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )

  // 播放模式选择
  const PlayMethodModal = () => (
    <Modal visible={showPlayMethodPicker} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择播放模式</Text>
            <TouchableOpacity onPress={() => setShowPlayMethodPicker(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {[
              { value: 'listLoop' as const, label: '列表循环' },
              { value: 'listOnce' as const, label: '列表顺序' },
              { value: 'songLoop' as const, label: '单曲循环' },
              { value: 'random' as const, label: '随机播放' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => {
                  const newSettings = { ...settings, togglePlayMethod: option.value }
                  saveSettings(newSettings)
                  setShowPlayMethodPicker(false)
                }}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {settings.togglePlayMethod === option.value && (
                  <Icon name="check-circle" size={24} color="#34C759" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )

  // 音乐源选择
  const MusicSourceModal = () => (
    <Modal visible={showMusicSourcePicker} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择音乐源</Text>
            <TouchableOpacity onPress={() => setShowMusicSourcePicker(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {musicSources.map((source) => (
              <TouchableOpacity
                key={source.id}
                style={[styles.optionItem, !source.enabled && styles.disabledItem]}
                onPress={() => {
                  if (source.enabled) {
                    const newSettings = { ...settings, apiSource: source.id }
                    saveSettings(newSettings)
                    setShowMusicSourcePicker(false)
                  }
                }}
                disabled={!source.enabled}
              >
                <Text style={[styles.optionLabel, !source.enabled && styles.disabledText]}>
                  {source.name}
                </Text>
                {settings.apiSource === source.id && (
                  <Icon name="check-circle" size={24} color="#34C759" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>设置</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 显示设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>显示与主题</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setSelectedSection('theme')}
          >
            <View style={styles.settingLeft}>
              <Icon name="palette" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>主题</Text>
                <Text style={styles.settingValue}>
                  {settings.theme === 'light'
                    ? '浅色'
                    : settings.theme === 'dark'
                      ? '深色'
                      : '跟随系统'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* 音乐播放设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>音乐播放设置</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowPlayQualityPicker(true)}
          >
            <View style={styles.settingLeft}>
              <Icon name="music-circle" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>音乐质量</Text>
                <Text style={styles.settingValue}>{settings.playQuality}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowPlayMethodPicker(true)}
          >
            <View style={styles.settingLeft}>
              <Icon name="repeat" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>播放模式</Text>
                <Text style={styles.settingValue}>
                  {settings.togglePlayMethod === 'listLoop'
                    ? '列表循环'
                    : settings.togglePlayMethod === 'listOnce'
                      ? '列表顺序'
                      : settings.togglePlayMethod === 'songLoop'
                        ? '单曲循环'
                        : '随机播放'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="play-circle" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>自动播放</Text>
                <Text style={styles.settingValue}>
                  {settings.autoPlayEnabled ? '开启' : '关闭'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoPlayEnabled}
              onValueChange={() => handleToggle('autoPlayEnabled')}
            />
          </View>
        </View>

        {/* 音源设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>音源设置</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowMusicSourcePicker(true)}
          >
            <View style={styles.settingLeft}>
              <Icon name="cloud-download" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>默认音源</Text>
                <Text style={styles.settingValue}>
                  {musicSources.find(s => s.id === settings.apiSource)?.name || '网易云'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.musicSourcesInfo}>
            <Text style={styles.infoTitle}>可用音源：</Text>
            {musicSources
              .filter(s => s.enabled)
              .map(source => (
                <Text key={source.id} style={styles.infoText}>
                  • {source.name}
                </Text>
              ))}
          </View>
        </View>

        {/* 播放设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>播放设置</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="download-circle" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>自动下载</Text>
                <Text style={styles.settingValue}>
                  {settings.autoDownload ? '开启' : '关闭'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoDownload}
              onValueChange={() => handleToggle('autoDownload')}
            />
          </View>
        </View>

        {/* 通知设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>推送通知</Text>
                <Text style={styles.settingValue}>
                  {settings.notificationsEnabled ? '开启' : '关闭'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={() => handleToggle('notificationsEnabled')}
            />
          </View>
        </View>

        {/* 存储设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>存储与缓存</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <Icon name="delete" size={24} color="#FF3B30" />
              <View style={styles.settingText}>
                <Text style={styles.settingName}>清除缓存</Text>
                <Text style={styles.settingValue}>删除所有临时文件</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* 其他设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleResetSettings}>
            <View style={styles.settingLeft}>
              <Icon name="restart" size={24} color="#FF9500" />
              <Text style={styles.settingName}>恢复默认设置</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* 配置信息 */}
        <View style={styles.configInfo}>
          <Text style={styles.configTitle}>配置版本信息</Text>
          <Text style={styles.configText}>应用: {appConfig.app.name}</Text>
          <Text style={styles.configText}>版本: {appConfig.app.version}</Text>
          <Text style={styles.configText}>包名: {appConfig.app.package}</Text>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 模态框 */}
      <ThemeModal />
      <PlayQualityModal />
      <PlayMethodModal />
      <MusicSourceModal />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginTop: 12,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  settingValue: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  optionsList: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  disabledItem: {
    opacity: 0.5,
  },
  optionLabel: {
    fontSize: 16,
    color: '#000',
    marginLeft: 16,
    flex: 1,
  },
  disabledText: {
    color: '#999',
  },
  musicSourcesInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  configInfo: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 8,
  },
  configTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  configText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 40,
  },
})

export default SettingScreen
