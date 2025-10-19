import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface FileItem {
  id: string
  name: string
  content: string
  extension: string
  lastModified: string
}

interface RecentFile {
  id: string
  name: string
  time: string
}

const SUPPORTED_FORMATS = [
  '.txt',
  '.md',
  '.js',
  '.ts',
  '.tsx',
  '.json',
  '.html',
  '.css',
  '.xml',
  '.java',
]

const FileEditorScreen: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingContent, setEditingContent] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [selectedExtension, setSelectedExtension] = useState('.txt')

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      Alert.alert('提示', '请输入文件名')
      return
    }

    const fileName = newFileName.endsWith(selectedExtension)
      ? newFileName
      : newFileName + selectedExtension

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: fileName,
      content: '',
      extension: selectedExtension,
      lastModified: new Date().toLocaleString('zh-CN'),
    }

    setFiles([newFile, ...files])
    setRecentFiles([
      { id: newFile.id, name: fileName, time: new Date().toLocaleTimeString('zh-CN') },
      ...recentFiles.slice(0, 4),
    ])
    setNewFileName('')
    setSelectedExtension('.txt')
    setCreateModalVisible(false)
    Alert.alert('成功', '文件创建成功')
  }

  const handleOpenFile = (file: FileItem) => {
    setCurrentFile(file)
    setEditingContent(file.content)
    setIsEditing(true)

    // 添加到最近使用文件
    const newRecent = recentFiles.filter((f) => f.id !== file.id)
    setRecentFiles([
      { id: file.id, name: file.name, time: new Date().toLocaleTimeString('zh-CN') },
      ...newRecent.slice(0, 4),
    ])
  }

  const handleSaveFile = () => {
    if (!currentFile) return

    const updatedFile: FileItem = {
      ...currentFile,
      content: editingContent,
      lastModified: new Date().toLocaleString('zh-CN'),
    }

    setFiles(files.map((f) => (f.id === currentFile.id ? updatedFile : f)))
    setCurrentFile(updatedFile)
    Alert.alert('成功', '文件已保存')
  }

  const handleDeleteFile = (fileId: string) => {
    Alert.alert('删除文件', '确定要删除此文件吗？', [
      { text: '取消' },
      {
        text: '删除',
        onPress: () => {
          setFiles(files.filter((f) => f.id !== fileId))
          if (currentFile?.id === fileId) {
            setCurrentFile(null)
            setIsEditing(false)
          }
        },
      },
    ])
  }

  const handleCloseEditor = () => {
    if (editingContent !== currentFile?.content) {
      Alert.alert('提示', '内容未保存，是否保存？', [
        { text: '放弃', onPress: () => setIsEditing(false) },
        { text: '保存', onPress: () => { handleSaveFile(); setIsEditing(false) } },
      ])
    } else {
      setIsEditing(false)
    }
  }

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <Icon name="file-document" size={24} color="#007AFF" />
        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.fileTime}>{item.lastModified}</Text>
        </View>
      </View>
      <View style={styles.fileActions}>
        <TouchableOpacity onPress={() => handleOpenFile(item)} style={styles.actionButton}>
          <Icon name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteFile(item.id)} style={styles.actionButton}>
          <Icon name="trash-can-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderRecentFile = ({ item }: { item: RecentFile }) => (
    <TouchableOpacity
      style={styles.recentFileItem}
      onPress={() => {
        const file = files.find((f) => f.id === item.id)
        if (file) handleOpenFile(file)
      }}
    >
      <Icon name="history" size={16} color="#666" />
      <View style={styles.recentFileInfo}>
        <Text style={styles.recentFileName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.recentFileTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  )

  if (isEditing && currentFile) {
    return (
      <View style={styles.container}>
        {/* 编辑器工具栏 */}
        <View style={styles.editorHeader}>
          <TouchableOpacity onPress={handleCloseEditor}>
            <Icon name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.editorTitle} numberOfLines={1}>
            {currentFile.name}
          </Text>
          <TouchableOpacity onPress={handleSaveFile}>
            <Icon name="check" size={24} color="#34C759" />
          </TouchableOpacity>
        </View>

        {/* 文件信息栏 */}
        <View style={styles.fileInfoBar}>
          <Text style={styles.fileInfoText}>
            {editingContent.length} 字符 • {selectedExtension}
          </Text>
        </View>

        {/* 代码编辑区 */}
        <TextInput
          style={styles.codeEditor}
          value={editingContent}
          onChangeText={setEditingContent}
          multiline
          placeholder="编辑内容..."
          placeholderTextColor="#999"
          textAlignVertical="top"
          fontFamily="monospace"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>文件编辑器</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 快速操作 */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <Icon name="plus" size={32} color="#fff" />
            <Text style={styles.quickActionText}>新建文件</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="folder-open" size={32} color="#fff" />
            <Text style={styles.quickActionText}>打开文件</Text>
          </TouchableOpacity>
        </View>

        {/* 最近文件 */}
        {recentFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>最近文件</Text>
            {recentFiles.map((item) => (
              <View key={item.id}>
                {renderRecentFile({ item })}
              </View>
            ))}
          </View>
        )}

        {/* 所有文件 */}
        {files.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>所有文件</Text>
            <FlatList
              data={files}
              keyExtractor={(item) => item.id}
              renderItem={renderFileItem}
              scrollEnabled={false}
            />
          </View>
        )}

        {files.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="file-document" size={60} color="#CCC" />
            <Text style={styles.emptyText}>还没有文件</Text>
            <Text style={styles.emptySubText}>点击"新建文件"开始创建</Text>
          </View>
        )}

        {/* 支持格式说明 */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>支持格式</Text>
          <Text style={styles.supportText}>{SUPPORTED_FORMATS.join(', ')}</Text>
        </View>
      </ScrollView>

      {/* 创建文件模态框 */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>创建新文件</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="输入文件名"
              placeholderTextColor="#999"
              value={newFileName}
              onChangeText={setNewFileName}
            />

            <View style={styles.extensionPicker}>
              <Text style={styles.pickerLabel}>文件类型:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SUPPORTED_FORMATS.map((ext) => (
                  <TouchableOpacity
                    key={ext}
                    style={[
                      styles.extensionButton,
                      selectedExtension === ext && styles.extensionButtonActive,
                    ]}
                    onPress={() => setSelectedExtension(ext)}
                  >
                    <Text
                      style={[
                        styles.extensionButtonText,
                        selectedExtension === ext && styles.extensionButtonTextActive,
                      ]}
                    >
                      {ext}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setCreateModalVisible(false)
                  setNewFileName('')
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateFile}
              >
                <Text style={styles.createButtonText}>创建</Text>
              </TouchableOpacity>
            </View>
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
  quickActionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  fileTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  fileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  recentFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentFileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  recentFileName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  recentFileTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#000',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  supportSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  supportText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  // 编辑器样式
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  editorTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
    color: '#000',
  },
  fileInfoBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  fileInfoText: {
    fontSize: 12,
    color: '#666',
  },
  codeEditor: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  // 模态框样式
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  extensionPicker: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  extensionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginRight: 8,
  },
  extensionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  extensionButtonText: {
    fontSize: 12,
    color: '#666',
  },
  extensionButtonTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default FileEditorScreen
