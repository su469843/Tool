import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: string
}

const AIChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  // 模拟 AI 回复
  const getAIResponse = (userMessage: string): string => {
    const responses: { [key: string]: string[] } = {
      hello: [
        '你好！很高兴认识你。',
        '嗨！有什么我可以帮助你的吗？',
        '你好啊！今天过得如何？',
      ],
      help: [
        '我可以帮你聊天、回答问题、或者给出建议。',
        '我很乐意帮忙！告诉我你需要什么？',
        '我能帮你解答疑问或者只是陪你聊天。',
      ],
      thanks: ['不客气！很高兴为你服务。', '乐意效劳！', '这是我的荣幸！'],
      time: [
        `现在是 ${new Date().toLocaleTimeString('zh-CN')}`,
        `当前时间：${new Date().toLocaleTimeString('zh-CN')}`,
      ],
      date: [
        `今天是 ${new Date().toLocaleDateString('zh-CN')}`,
        `当前日期：${new Date().toLocaleDateString('zh-CN')}`,
      ],
    }

    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('hello') || lowerMessage.includes('你好')) {
      return responses.hello[Math.floor(Math.random() * responses.hello.length)]
    } else if (lowerMessage.includes('help') || lowerMessage.includes('帮')) {
      return responses.help[Math.floor(Math.random() * responses.help.length)]
    } else if (lowerMessage.includes('thanks') || lowerMessage.includes('谢')) {
      return responses.thanks[Math.floor(Math.random() * responses.thanks.length)]
    } else if (lowerMessage.includes('time') || lowerMessage.includes('时间')) {
      return responses.time[Math.floor(Math.random() * responses.time.length)]
    } else if (lowerMessage.includes('date') || lowerMessage.includes('日期')) {
      return responses.date[Math.floor(Math.random() * responses.date.length)]
    } else {
      return '这是一个很有趣的问题！请告诉我更多详情。'
    }
  }

  const handleSendMessage = async() => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // 模拟 AI 回复延迟
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 800)
  }

  const handleClearHistory = () => {
    Alert.alert('清空记录', '确定要清空所有对话记录吗？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => setMessages([]),
      },
    ])
  }

  const handleExportChat = () => {
    if (messages.length === 0) {
      Alert.alert('提示', '没有对话记录可导出')
      return
    }

    let chatText = '=== 对话记录 ===\n'
    messages.forEach((msg) => {
      const sender = msg.sender === 'user' ? '你' : 'AI'
      chatText += `\n[${msg.timestamp}] ${sender}:\n${msg.text}\n`
    })

    Alert.alert('导出成功', '对话记录已复制到剪贴板', [{ text: '确定' }])
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'

    return (
      <View style={[styles.messageContainer, isUser && styles.userContainer]}>
        <View style={[styles.messageBubble, isUser && styles.userBubble]}>
          <Text style={[styles.messageText, isUser && styles.userText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>AI 智能助手</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleClearHistory} style={styles.headerButton}>
            <Icon name="delete" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExportChat} style={styles.headerButton}>
            <Icon name="download" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 消息列表 */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="chat-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>开始对话吧！</Text>
          <Text style={styles.emptySubText}>尝试问我一些问题</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {/* 加载指示 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>AI 正在回复...</Text>
        </View>
      )}

      {/* 输入框 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入问题或聊天内容..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxHeight={100}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#000',
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    color: '#999',
  },
  messageList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  userTimestamp: {
    color: '#E8E8E8',
  },
  loadingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
})

export default AIChatScreen
