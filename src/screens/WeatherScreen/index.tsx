import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  FlatList,
  Modal,
  TextInput,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface WeatherData {
  id: string
  city: string
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

interface WeatherWidget {
  id: string
  city: string
  temp: number
  condition: string
  size: 'small' | 'medium' | 'large'
}

const WEATHER_STORAGE_KEY = 'WEATHER_DATA'
const WIDGETS_STORAGE_KEY = 'WEATHER_WIDGETS'

const WeatherScreen: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [widgets, setWidgets] = useState<WeatherWidget[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [cityInput, setCityInput] = useState('')

  const mockWeatherData: WeatherData = {
    id: Date.now().toString(),
    city: '北京',
    temp: 18,
    condition: '晴天',
    humidity: 65,
    windSpeed: 15,
    icon: 'weather-sunny',
  }

  useEffect(() => {
    loadWeatherData()
    loadWidgets()
  }, [])

  const loadWeatherData = async() => {
    try {
      const stored = await AsyncStorage.getItem(WEATHER_STORAGE_KEY)
      if (stored) {
        setWeatherData(JSON.parse(stored))
      } else {
        const initialData = [mockWeatherData]
        setWeatherData(initialData)
        await AsyncStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(initialData))
      }
    } catch (err) {
      console.warn('Failed to load weather data:', err)
    }
  }

  const loadWidgets = async() => {
    try {
      const stored = await AsyncStorage.getItem(WIDGETS_STORAGE_KEY)
      if (stored) {
        setWidgets(JSON.parse(stored))
      }
    } catch (err) {
      console.warn('Failed to load widgets:', err)
    }
  }

  const handleRefresh = async() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Alert.alert('已更新', '天气信息已更新')
    }, 1000)
  }

  const handleAddCity = async() => {
    if (!cityInput.trim()) {
      Alert.alert('提示', '请输入城市名称')
      return
    }

    const newWeather: WeatherData = {
      id: Date.now().toString(),
      city: cityInput,
      temp: Math.floor(Math.random() * 30 + 5),
      condition: ['晴天', '多云', '阴天', '小雨', '中雨'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 40 + 40),
      windSpeed: Math.floor(Math.random() * 30),
      icon: 'weather-sunny',
    }

    const updated = [...weatherData, newWeather]
    setWeatherData(updated)
    await AsyncStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(updated))
    setCityInput('')
    setModalVisible(false)
  }

  const handleDeleteCity = async(id: string) => {
    const updated = weatherData.filter((w) => w.id !== id)
    setWeatherData(updated)
    await AsyncStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(updated))

    const updatedWidgets = widgets.filter((w) => w.id !== id)
    setWidgets(updatedWidgets)
    await AsyncStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(updatedWidgets))
  }

  const handleAddWidget = async(weather: WeatherData) => {
    const existing = widgets.find((w) => w.id === weather.id)
    if (existing) {
      Alert.alert('提示', '该城市已添加小组件')
      return
    }

    const newWidget: WeatherWidget = {
      id: weather.id,
      city: weather.city,
      temp: weather.temp,
      condition: weather.condition,
      size: 'medium',
    }

    const updated = [...widgets, newWidget]
    setWidgets(updated)
    await AsyncStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(updated))
    Alert.alert('成功', `已将${weather.city}天气添加到小组件`)
  }

  const renderWeatherCard = ({ item }: { item: WeatherData }) => (
    <View style={styles.weatherCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cityName}>{item.city}</Text>
        <TouchableOpacity onPress={() => handleDeleteCity(item.id)}>
          <Icon name="close" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.tempSection}>
          <Icon name={item.icon} size={48} color="#FF9500" />
          <Text style={styles.temp}>{item.temp}°C</Text>
        </View>

        <View style={styles.conditionSection}>
          <Text style={styles.condition}>{item.condition}</Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Icon name="water" size={16} color="#007AFF" />
              <Text style={styles.detailText}>{item.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="weather-windy" size={16} color="#34C759" />
              <Text style={styles.detailText}>{item.windSpeed}km/h</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addWidgetButton}
        onPress={() => handleAddWidget(item)}
      >
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.addWidgetText}>添加小组件</Text>
      </TouchableOpacity>
    </View>
  )

  const renderWidget = ({ item }: { item: WeatherWidget }) => (
    <View style={styles.widget}>
      <View style={styles.widgetHeader}>
        <Text style={styles.widgetCity}>{item.city}</Text>
        <Text style={styles.widgetTemp}>{item.temp}°C</Text>
      </View>
      <Text style={styles.widgetCondition}>{item.condition}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>天气查询</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {widgets.length > 0 && (
          <View style={styles.widgetsSection}>
            <Text style={styles.sectionTitle}>小组件</Text>
            <FlatList
              data={widgets}
              keyExtractor={(item) => item.id}
              renderItem={renderWidget}
              scrollEnabled={false}
              numColumns={2}
            />
          </View>
        )}

        <View style={styles.weatherSection}>
          <Text style={styles.sectionTitle}>天气信息</Text>
          {weatherData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="weather-cloudy" size={60} color="#CCC" />
              <Text style={styles.emptyText}>还没有添加城市</Text>
            </View>
          ) : (
            <FlatList
              data={weatherData}
              keyExtractor={(item) => item.id}
              renderItem={renderWeatherCard}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipTitle}>小组件功能说明</Text>
          <Text style={styles.tipText}>• 点击"添加小组件"可将天气卡片添加到小组件区域</Text>
          <Text style={styles.tipText}>• 小组件支持小、中、大三种尺寸显示</Text>
          <Text style={styles.tipText}>• 下拉刷新可更新所有城市天气信息</Text>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>添加城市</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="输入城市名称（如：北京、上海）"
              placeholderTextColor="#999"
              value={cityInput}
              onChangeText={setCityInput}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddCity}>
              <Text style={styles.addButtonText}>添加</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  widgetsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  weatherSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tempSection: {
    alignItems: 'center',
    marginRight: 20,
  },
  temp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9500',
    marginTop: 8,
  },
  conditionSection: {
    flex: 1,
    justifyContent: 'center',
  },
  condition: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  addWidgetButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWidgetText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  widget: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginRight: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  widgetCity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  widgetTemp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  widgetCondition: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default WeatherScreen
