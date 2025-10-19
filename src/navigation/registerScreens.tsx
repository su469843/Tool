// @flow

import { Navigation } from 'react-native-navigation'

import {
  PlayDetail,
  SonglistDetail,
  Comment,
} from '@/screens'
import WheelScreen from '@/screens/WheelScreen'
import AIChatScreen from '@/screens/AIChatScreen'
import VideoScreen from '@/screens/VideoScreen'
import FileEditorScreen from '@/screens/FileEditorScreen'
import WeatherScreen from '@/screens/WeatherScreen'
import SettingScreen from '@/screens/SettingScreen'
import { Provider } from '@/store/Provider'

import {
  WHEEL_SCREEN,
  AI_CHAT_SCREEN,
  VIDEO_SCREEN,
  MUSIC_SCREEN,
  FILE_EDITOR_SCREEN,
  WEATHER_SCREEN,
  SETTING_SCREEN,
  PLAY_DETAIL_SCREEN,
  SONGLIST_DETAIL_SCREEN,
  COMMENT_SCREEN,
  VERSION_MODAL,
  PACT_MODAL,
  SYNC_MODE_MODAL,
} from './screenNames'
import VersionModal from './components/VersionModal'
import PactModal from './components/PactModal'
import SyncModeModal from './components/SyncModeModal'

function WrappedComponent(Component: any) {
  return function inject(props: Record<string, any>) {
    const EnhancedComponent = () => (
      <Provider>
        <Component
          {...props}
        />
      </Provider>
    )

    return <EnhancedComponent />
  }
}

export default () => {
  // 主屏幕（底部标签导航）
  Navigation.registerComponent(WHEEL_SCREEN, () => WrappedComponent(WheelScreen))
  Navigation.registerComponent(AI_CHAT_SCREEN, () => WrappedComponent(AIChatScreen))
  Navigation.registerComponent(VIDEO_SCREEN, () => WrappedComponent(VideoScreen))
  Navigation.registerComponent(FILE_EDITOR_SCREEN, () => WrappedComponent(FileEditorScreen))
  Navigation.registerComponent(WEATHER_SCREEN, () => WrappedComponent(WeatherScreen))
  Navigation.registerComponent(SETTING_SCREEN, () => WrappedComponent(SettingScreen))

  // 详情屏幕（音乐播放器）
  Navigation.registerComponent(PLAY_DETAIL_SCREEN, () => WrappedComponent(PlayDetail))
  Navigation.registerComponent(SONGLIST_DETAIL_SCREEN, () => WrappedComponent(SonglistDetail))
  Navigation.registerComponent(COMMENT_SCREEN, () => WrappedComponent(Comment))

  // 模态框
  Navigation.registerComponent(VERSION_MODAL, () => WrappedComponent(VersionModal))
  Navigation.registerComponent(PACT_MODAL, () => WrappedComponent(PactModal))
  Navigation.registerComponent(SYNC_MODE_MODAL, () => WrappedComponent(SyncModeModal))

  console.info('All screens have been registered...')
}
