import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  Vibration,
  FlatList,
} from 'react-native'
import { Svg, Circle, Path } from 'react-native-svg'

interface PrizeItem {
  id: number
  name: string
  color: string
}

interface HistoryRecord {
  id: string
  prize: string
  time: string
}

const WHEEL_PRIZES: PrizeItem[] = [
  { id: 1, name: '一等奖', color: '#FF6B6B' },
  { id: 2, name: '二等奖', color: '#FFA500' },
  { id: 3, name: '三等奖', color: '#FFD93D' },
  { id: 4, name: '优秀奖', color: '#6BCB77' },
  { id: 5, name: '参与奖', color: '#4D96FF' },
  { id: 6, name: '幸运奖', color: '#BB86FC' },
]

const WheelScreen: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [resultVisible, setResultVisible] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<PrizeItem | null>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const spinAnim = useRef(new Animated.Value(0)).current

  const handleSpin = () => {
    if (isSpinning) return

    setIsSpinning(true)

    const randomPrizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length)
    const prize = WHEEL_PRIZES[randomPrizeIndex]

    const rotations = 5 // 转5圈
    const targetRotation = rotations * 360 + (randomPrizeIndex * 60)

    Animated.timing(spinAnim, {
      toValue: targetRotation,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setSelectedPrize(prize)
      setResultVisible(true)
      setIsSpinning(false)

      // 添加到历史记录
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        prize: prize.name,
        time: new Date().toLocaleTimeString('zh-CN'),
      }
      setHistory([newRecord, ...history])

      // 震动反馈
      Vibration.vibrate([0, 100, 100, 100])
    })
  }

  const spin = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>幸运大转盘</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 转盘区域 */}
        <View style={styles.wheelContainer}>
          <Animated.View
            style={[
              styles.wheel,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            {renderWheel()}
          </Animated.View>

          {/* 指针 */}
          <View style={styles.pointer} />
        </View>

        {/* 抽奖按钮 */}
        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
          onPress={handleSpin}
          disabled={isSpinning}
        >
          <Text style={styles.spinButtonText}>
            {isSpinning ? '转盘中...' : '开始抽奖'}
          </Text>
        </TouchableOpacity>

        {/* 历史记录 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>抽奖记录</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>暂无抽奖记录</Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <Text style={styles.historyPrize}>{item.prize}</Text>
                  <Text style={styles.historyTime}>{item.time}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* 结果弹窗 */}
      <Modal visible={resultVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.resultModal}>
            <Text style={styles.resultTitle}>恭喜获奖！</Text>
            <View style={[styles.resultPrizeBox, { backgroundColor: selectedPrize?.color }]}>
              <Text style={styles.resultPrizeText}>{selectedPrize?.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={() => setResultVisible(false)}
            >
              <Text style={styles.resultButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function renderWheel() {
  const radius = 100
  const angle = 360 / WHEEL_PRIZES.length

  return (
    <Svg width={220} height={220} viewBox="0 0 220 220">
      {WHEEL_PRIZES.map((prize, index) => {
        const startAngle = (index * angle - 90) * (Math.PI / 180)
        const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180)

        const x1 = 110 + radius * Math.cos(startAngle)
        const y1 = 110 + radius * Math.sin(startAngle)
        const x2 = 110 + radius * Math.cos(endAngle)
        const y2 = 110 + radius * Math.sin(endAngle)

        const largeArcFlag = angle > 180 ? 1 : 0
        const pathData = `M 110 110 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

        return (
          <Path
            key={`slice-${index}`}
            d={pathData}
            fill={prize.color}
            stroke="#fff"
            strokeWidth="2"
          />
        )
      })}

      <Circle cx="110" cy="110" r="20" fill="#fff" />
    </Svg>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  wheel: {
    width: 220,
    height: 220,
  },
  pointer: {
    position: 'absolute',
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#007AFF',
  },
  spinButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  spinButtonDisabled: {
    backgroundColor: '#CCC',
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historySection: {
    marginVertical: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyPrize: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  historyTime: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  resultPrizeBox: {
    width: '100%',
    paddingVertical: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resultPrizeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  resultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default WheelScreen
