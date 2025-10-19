import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  WHEEL_SCREEN,
  AI_CHAT_SCREEN,
  VIDEO_SCREEN,
  MUSIC_SCREEN,
  FILE_EDITOR_SCREEN,
  WEATHER_SCREEN,
  SETTING_SCREEN,
} from './screenNames'

import themeState from '@/store/theme/state'
import { getStatusBarStyle } from './utils'

async function getTabIcon(name: string) {
  const iconMap: { [key: string]: string } = {
    [WHEEL_SCREEN]: 'palette-swatch-variant',
    [AI_CHAT_SCREEN]: 'chat-outline',
    [VIDEO_SCREEN]: 'video-outline',
    [MUSIC_SCREEN]: 'music-note-outline',
    [FILE_EDITOR_SCREEN]: 'file-document-outline',
    [WEATHER_SCREEN]: 'weather-sunny',
    [SETTING_SCREEN]: 'cog',
  }

  const iconName = iconMap[name]
  if (!iconName) return undefined

  try {
    const icon = await Icon.getImageSource(iconName, 24, '#666')
    const selectedIcon = await Icon.getImageSource(iconName, 24, '#007AFF')
    return { icon, selectedIcon }
  } catch (e) {
    console.warn('Failed to load icon:', iconName)
    return undefined
  }
}

export async function setupBottomTabs() {
  const theme = themeState.theme

  const tabLabels: { [key: string]: string } = {
    [WHEEL_SCREEN]: '转盘',
    [AI_CHAT_SCREEN]: 'AI对话',
    [VIDEO_SCREEN]: '视频',
    [MUSIC_SCREEN]: '音乐',
    [FILE_EDITOR_SCREEN]: '文件',
    [WEATHER_SCREEN]: '天气',
    [SETTING_SCREEN]: '设置',
  }

  const tabs = [
    { name: WHEEL_SCREEN, label: tabLabels[WHEEL_SCREEN] },
    { name: AI_CHAT_SCREEN, label: tabLabels[AI_CHAT_SCREEN] },
    { name: VIDEO_SCREEN, label: tabLabels[VIDEO_SCREEN] },
    { name: MUSIC_SCREEN, label: tabLabels[MUSIC_SCREEN] },
    { name: FILE_EDITOR_SCREEN, label: tabLabels[FILE_EDITOR_SCREEN] },
    { name: WEATHER_SCREEN, label: tabLabels[WEATHER_SCREEN] },
    { name: SETTING_SCREEN, label: tabLabels[SETTING_SCREEN] },
  ]

  const children = await Promise.all(
    tabs.map(async (tab) => {
      const icons = await getTabIcon(tab.name)

      return {
        stack: {
          children: [
            {
              component: {
                name: tab.name,
                options: {
                  topBar: {
                    visible: false,
                    height: 0,
                  },
                  statusBar: {
                    drawBehind: true,
                    visible: true,
                    style: getStatusBarStyle(theme.isDark),
                    backgroundColor: 'transparent',
                  },
                  layout: {
                    componentBackgroundColor: theme['c-content-background'],
                  },
                },
              },
            },
          ],
          options: {
            bottomTab: {
              text: tab.label,
              textColor: '#666',
              selectedTextColor: '#007AFF',
              ...icons,
            },
          },
        },
      }
    })
  )

  return Navigation.setRoot({
    root: {
      bottomTabs: {
        children,
        options: {
          bottomTabs: {
            backgroundColor: theme['c-content-background'],
            titleDisplayMode: 'alwaysShow',
          },
          statusBar: {
            drawBehind: false,
          },
        },
      },
    },
  })
}
