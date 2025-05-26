<script setup>
import {nextTick, onBeforeUnmount, onMounted, reactive, ref} from 'vue'
import {fetchEventSource} from '@microsoft/fetch-event-source'
import {addConversation, listConversation} from "@/api/ai/chat/conversation"
import {listMessageByCid} from "@/api/ai/chat/message"
import {userInfoX} from "@/store/userInfoX"
import {MoreFilled} from "@element-plus/icons-vue"
import {ElMessage} from 'element-plus'
import {Typewriter} from 'vue-element-plus-x'
import {Copy, Check, Refresh, ThumbsUp, ThumbsDown, Delete, EditTwo} from '@icon-park/vue-next'
import {parseTime} from "@/utils/roydon"

// Prism 核心基础样式（必须导入，包含语法高亮的基础样式和结构）
import 'vue-element-plus-x/styles/prism.min.css'
// 1. Coy 主题（简约浅色风格，适合日常阅读）
import 'vue-element-plus-x/styles/prism-coy.min.css'

const scrollbarRef = ref()
const max = ref(0)

// Request body
const requestBody = reactive({
  pageNum: 1,
  pageSize: 20
})
const conversationExpand = ref(false)
const conversationList = ref()
const conversationListLoading = ref(true) // 0 is empty, 1 is request failed
const conversationListTotal = ref(0)
const conversationListGroups = ref({
  today: [],
  yesterday: [],
  lastWeek: [],
  lastMonth: [],
  lastYear: [],
  older: [],
})
const selectedConversationId = ref('')

const getGroupTitle = (group) => {
  const titles = {
    today: '今天',
    yesterday: '昨天',
    lastWeek: '一周内',
    lastMonth: '一月内',
    lastYear: '一年内',
    older: '更早'
  }
  return titles[group]
}

const getConversationList = () => {
  listConversation(requestBody).then(res => {
    if (res?.code === 200) {
      conversationList.value = res?.rows
      conversationListTotal.value = res?.total
      // Process conversations, group them
      handleConversationGroup()
      conversationListLoading.value = false
    }
  })
}

/**
 * Process conversations and group them
 */
const handleConversationGroup = () => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const lastWeekStart = new Date(todayStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const lastMonthStart = new Date(todayStart)
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
  const lastYearStart = new Date(todayStart)
  lastYearStart.setFullYear(lastYearStart.getFullYear() - 1)

  // Reset groups
  conversationListGroups.value = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    lastYear: [],
    older: [],
  }

  // Group conversations
  conversationList.value?.forEach(conversation => {
    const convDate = new Date(conversation.createTime)

    if (convDate >= todayStart) {
      conversationListGroups.value.today.push(conversation)
    } else if (convDate >= yesterdayStart) {
      conversationListGroups.value.yesterday.push(conversation)
    } else if (convDate >= lastWeekStart) {
      conversationListGroups.value.lastWeek.push(conversation)
    } else if (convDate >= lastMonthStart) {
      conversationListGroups.value.lastMonth.push(conversation)
    } else if (convDate >= lastYearStart) {
      conversationListGroups.value.lastYear.push(conversation)
    } else {
      conversationListGroups.value.older.push(conversation)
    }
  })
}

const handleSelectConversation = (id) => {
  if (selectedConversationId.value === id) {
    return
  }
  selectedConversationId.value = id
  // Clear message list
  messages.value = []
  // Focus input
  inputRef.value?.focus()
  // Request message list
  listMessageByCid({cid: selectedConversationId.value}).then(res => {
    if (res?.code === 200) {
      messages.value = res?.data
      // Scroll to bottom of conversation
      nextTick(() => {
        max.value = messageContainer.value.clientHeight
        scrollbarRef.value.setScrollTop(max.value)
      })
    }
  })
}

// Format relative time
const formatRelativeTime = (dateStr) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365

  if (diffInSeconds < minute) {
    return '刚刚'
  } else if (diffInSeconds < hour) {
    return `${Math.floor(diffInSeconds / minute)}分钟前`
  } else if (diffInSeconds < day) {
    return `${Math.floor(diffInSeconds / hour)}小时前`
  } else if (diffInSeconds < week) {
    return `${Math.floor(diffInSeconds / day)}天前`
  } else if (diffInSeconds < month) {
    return `${Math.floor(diffInSeconds / week)}周前`
  } else if (diffInSeconds < year) {
    return `${Math.floor(diffInSeconds / month)}个月前`
  } else {
    return `${Math.floor(diffInSeconds / year)}年前`
  }
}

const MessageStatus = {
  Streaming: 'streaming',
  Complete: 'complete',
  Error: 'error'
}

const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const controller = ref()
const messageContainer = ref()
const inputRef = ref()

// Listen to message list changes and automatically scroll to bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      max.value = messageContainer.value.clientHeight
      scrollbarRef.value.setScrollTop(max.value)
    }
  })
}

// Character type detection
const getCharType = (char) => {
  if (/[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/.test(char)) {
    return 'chinese'
  }
  if (/[a-zA-Z]/.test(char)) {
    return 'english'
  }
  return 'other'
}

// Smart space processing core logic
const processContent = (prev, newData) => {
  if (prev.length === 0) return newData

  const lastChar = prev.slice(-1)
  const newFirstChar = newData[0] || ''

  const prevType = getCharType(lastChar)
  const newType = getCharType(newFirstChar)

  let processed = newData

  // Cases where space should be added
  const shouldAddSpace =
      (prevType === 'english' && newType === 'english') || // English followed by English
      (prevType === 'chinese' && newType === 'english') || // Chinese followed by English
      (prevType === 'english' && newType === 'chinese' && !/[!?,.]$/.test(lastChar)) // English followed by Chinese (not ending with punctuation)

  // Cases where space should be removed
  const shouldRemoveSpace =
      (prevType === 'chinese' && newType === 'chinese') || // Chinese followed by Chinese
      (prevType === 'other' && /^[\u4e00-\u9fa5]/.test(newData)) // Special character followed by Chinese

  if (shouldAddSpace && !lastChar.match(/\s/) && !newFirstChar.match(/\s/)) {
    processed = ' ' + processed
  } else if (shouldRemoveSpace) {
    processed = processed.replace(/^\s+/, '')
  }

  return processed
}

const sendChatRequest = async (conversationId, content, botMessage) => {
  controller.value = new AbortController()

  await fetchEventSource('http://localhost:9101/web-api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'X-Content-Lang': 'zh-CN'
    },
    body: JSON.stringify({
      conversationId: conversationId,
      message: content,
      userId: userInfoX().userInfo?.userId
    }),
    signal: controller.value?.signal,
    openWhenHidden: true,

    onopen: async response => {
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    },

    onmessage: event => {
      if (event.data === '[DONE]') {
        botMessage.status = MessageStatus.Complete
        return
      }

      const processedData = processContent(botMessage.content, event.data)
      botMessage.content += processedData
      botMessage.timestamp = Date.now()

      scrollToBottom()
    },

    onerror: err => {
      throw err
    }
  })
}

// Error handling
const handleRequestError = (botMessage, error) => {
  const errorMessage = error instanceof Error
      ? navigator.onLine
          ? error.message
          : '网络连接不可用'
      : '请求发生未知错误'

  botMessage.status = MessageStatus.Error
  botMessage.content = errorMessage
}

// Main send logic
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userContent = inputMessage.value.trim()
  inputMessage.value = ''

  if (!selectedConversationId.value) {
    // First create conversation
    await addConversation({title: userContent}).then(res => {
      if (res?.code === 200) {
        // Insert into conversation list
        conversationListGroups.value.today.unshift(res.data)
        selectedConversationId.value = res.data.id
      } else {
        ElMessage.error('创建对话失败')
        return
      }
    })
  }
  const createTime = parseTime(Date.now())
  // Create user message
  const userMessage = reactive({
    id: `user-${Date.now()}`,
    content: userContent,
    isBot: false,
    timestamp: Date.now(),
    status: MessageStatus.Complete,
    conversationId: selectedConversationId.value,
    messageType: 'user',
    createTime: createTime,
    replayId: '',
    updateTime: createTime,
    useContext: '1',
    userId: userInfoX().userInfo?.userId
  })
  messages.value.push(userMessage)

  // Create bot message
  const botMessage = reactive({
    id: `bot-${Date.now()}`,
    content: '',
    isBot: true,
    status: MessageStatus.Streaming,
    timestamp: Date.now(),
    conversationId: selectedConversationId.value,
    messageType: 'assistant',
    createTime: createTime,
    replayId: '',
    updateTime: createTime,
    useContext: '1',
    userId: userInfoX().userInfo?.userId
  })
  messages.value.push(botMessage)

  isLoading.value = true
  const conversationId = selectedConversationId.value
  // Move scroller
  scrollToBottom()
  try {
    await sendChatRequest(conversationId, userContent, botMessage)
  } catch (err) {
    handleRequestError(botMessage, err)
  } finally {
    isLoading.value = false
    nextTick(() => inputRef.value?.focus())
  }
}

// Stop generation
const stopGeneration = () => {
  controller.value?.abort()
  isLoading.value = false
}

const handleClickConversationMore = (id) => {
  console.log(id)
}

const handleDeleteConversation = (id) => {
  console.log(id)
}

const handleEditConversation = (id) => {
  console.log(id)
}

// Expand/collapse conversation list
const handleClickConversationExpand = () => {
  conversationExpand.value = !conversationExpand.value
}

// Create new conversation
const handleCreateNewConversation = () => {
  addConversation({title: '新对话'}).then(res => {
    if (res?.code === 200) {
      // Insert into conversation list
      conversationListGroups.value.today.unshift(res.data)
      selectedConversationId.value = res.data.id
    } else {
      ElMessage.error('创建对话失败')
      return
    }
  })
  messages.value = [
    {
      id: 'bot-1',
      content: '你好，有什么可以帮到你的吗？',
      isBot: true,
      timestamp: Date.now(),
      status: MessageStatus.Complete,
      conversationId: '1',
      messageType: 'assistant',
      createTime: '2023-07-01 12:00:00Z',
      replayId: '0',
      updateTime: '2023-07-01 12:00:00Z',
      useContext: '0',
      userId: '1'
    }
  ]
}

// 消息处理
const copyFlag = ref(false)
const copyMessageId = ref('')
// 复制消息
const handleCopyMessage = async (id, message) => {
  try {
    await navigator.clipboard.writeText(message)
    copyFlag.value = true
    copyMessageId.value = id
    setTimeout(() => {
      copyFlag.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
/**
 * 删除消息
 * @param id 消息id
 */
const handleDeleteMessage = (id) => {
  console.log(id)
}
/**
 * 点击user消息编辑
 * @param id 消息id
 * @param content 消息内容
 */
const handleClickMessageEdit = (id, content) => {
  // 将内容填充到输入框，并聚焦输入
  inputMessage.value = content
  nextTick(() => inputRef.value?.focus())
}

const loading = ref(false);
const scrollContainer = ref(null);
const hasMore = ref(true); // 是否还有更多数据可加载
// el-scroll的另一种解决办法 https://blog.csdn.net/qq_62262918/article/details/140273735
const handleScroll = () => {
  const container = scrollContainer.value;
  if (!container) return;

  // 检查是否滚动到底部
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;
  console.log(scrollTop, scrollHeight, clientHeight)

  // 距离底部一定阈值(如50px)时触发加载
  const threshold = 0;
  if (scrollHeight - (scrollTop + clientHeight) <= threshold) {
    loadMore();
  }
};

const loadMore = () => {
  console.log('loadMore')
};

// 模拟加载数据
// const loadMore = async () => {
//   if (loading.value || !hasMore.value) return;
//
//   loading.value = true;
//   try {
//     // 这里替换为你的实际数据获取逻辑
//     const newItems = await fetchMoreData();
//     items.value = [...items.value, ...newItems];
//
//     // 如果没有更多数据了
//     if (newItems.length === 0) {
//       hasMore.value = false;
//     }
//   } finally {
//     loading.value = false;
//   }
// };

onMounted(() => {
  inputRef.value?.focus()
  getConversationList()
})

onBeforeUnmount(() => {
  controller.value?.abort()
})
</script>

<template>
  <div class="flex flex-1 w100" style="flex-direction: row">
    <div v-if="conversationExpand" class="flex flex-col w-64 border-r border-[var(--niuyin-border-color)]">
      <div class="p-4 border-b border-[var(--niuyin-border-color)]">
        <button
            @click="handleCreateNewConversation"
            class="w-full bg-[var(--niuyin-primary-color)] hover:bg-[var(--niuyin-primary-color-8)] text-white py-2 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
          <i class="fas fa-plus"></i>
          <span>新对话</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto" ref="scrollContainer" @scroll="handleScroll">
        <div class="px-4 pb-2">
          <el-skeleton :loading="conversationListLoading" animated>
            <template #template>
              <div class="space-y-4 mb-6">
                <el-skeleton-item variant="h3" style="width: 70%"/>
                <el-skeleton-item variant="text" style="width: 90%"/>
              </div>
              <div class="space-y-4 mb-6">
                <el-skeleton-item variant="h3" style="width: 70%"/>
                <el-skeleton-item variant="text" style="width: 90%"/>
              </div>
              <div class="space-y-4 mb-6">
                <el-skeleton-item variant="h3" style="width: 70%"/>
                <el-skeleton-item variant="text" style="width: 90%"/>
              </div>
            </template>
            <template #default>
              <div class="space-y-2" v-for="(group,index) in conversationListGroups">
                <h2 class="text-sm font-semibold text-gray-500 my-2" v-if="group.length>0">{{
                    getGroupTitle(index)
                  }}</h2>
                <div v-for="conversation in group"
                     :key="conversation.id"
                     @click="handleSelectConversation(conversation.id)"
                     class="p-3 rounded-2xl hover:bg-[var(--niuyin-primary-color-8)] hover:text-white cursor-pointer border hover:border-[var(--niuyin-border-color)] transition-all mb-2"
                     :class="selectedConversationId === conversation.id ? 'bg-[var(--niuyin-primary-color)] border-[var(--niuyin-border-color)] title-color-white' : 'border-[var(--niuyin-border-color)]'">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium truncate">{{ conversation.title }}</h3>
                    <span class="text-xs text-gray-500">{{ formatRelativeTime(conversation.updateTime) }}</span>
                  </div>
                  <div class="flex-row flex-between mt-1 flex-nowrap">
                    <p v-if="conversation.lastMessage" class="text-xs text-gray-400 mt-1 truncate">
                      {{ conversation.lastMessage || '······' }}</p>
                    <p v-else class="text-xs text-gray-500 mt-1 truncate">······</p>
                    <el-popover
                        placement="right"
                        trigger="click"
                    >
                      <template #reference>
                        <el-icon @click.stop="handleClickConversationMore(conversation.id)" class="ml-2">
                          <MoreFilled class="" color="grey"/>
                        </el-icon>
                      </template>
                      <template #default>
                        <div class="p-4 flex flex-col">
                          <button
                              class="text-sm border border-[var(--niuyin-border-color)] rounded-xl py-2 px-3 hover:bg-[var(--niuyin-primary-color-8)] bg-[var(--niuyin-primary-color)] transition-colors flex items-center justify-center gap-1"
                              @click="handleEditConversation(conversation.id)">
                            <i class="fas fa-italic text-white"></i>
                            <span class="fs8 text-white">重命名</span>
                          </button>
                          <button
                              class="mt-2 text-sm border border-[var(--niuyin-border-color)] rounded-xl py-2 px-3 hover:bg-[var(--niuyin-primary-color-8)] bg-[var(--niuyin-primary-color)] transition-colors flex items-center justify-center gap-1"
                              @click="handleDeleteConversation(conversation.id)">
                            <i class="fas fa-trash-alt text-white"></i>
                            <span class="fs8 text-white">删除</span>
                          </button>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>

    </div>
    <div class="flex flex-1 flex-col" style="width: calc(100% - 16rem)">

      <!-- 聊天内容区域 -->
      <div class="flex flex-1 flex-col oh bg-gradient-to-b to-gray-50">
        <el-scrollbar v-if="!selectedConversationId">
          <div class="flex-1 overflow-y-auto p-12">
            <!-- 英雄区域 -->
            <section class="flex items-center justify-between mb-24">
              <div class="w-1/2">
                <h1 class="text-5xl font-bold mb-6">与<span class="gradient-text">AI</span>开启<span
                    class="gradient-text">智慧对话</span></h1>
                <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                  我们的AI聊天助手能够理解您的需求，提供准确、有用的回答。
                  无论是工作问题、学习辅导还是创意灵感，都能为您提供帮助。
                </p>
                <div class="flex space-x-4">
                  <button
                      @click="handleClickConversationExpand"
                      class="px-8 py-3 bg-[var(--niuyin-primary-color)] text-white rounded-full font-medium hover:bg-[var(--niuyin-primary-color-8)] transition-all shadow-md hover:shadow-lg">
                    立即体验
                  </button>
                  <button
                      class="px-8 py-3 border border-[var(--niuyin-border-color)] text-[var(--niuyin-primary-color)] hover:text-[var(--niuyin-text-color)] rounded-full font-medium hover:bg-[var(--niuyin-primary-color-8)] transition-all">
                    观看演示
                  </button>
                </div>
              </div>
              <div class="w-1/2 flex justify-center">
                <div class="relative w-96 h-96">
                  <!-- 聊天气泡示例 -->
                  <div
                      class="absolute top-0 left-0 bg-[var(--bg-video-card)] p-4 chat-bubble w-64 rounded-2xl cp hover:scale-105 transition-all">
                    <p class=" ">你好！今天有什么我可以帮助你的吗？</p>
                  </div>
                  <div
                      class="absolute top-24 right-0 bg-[var(--niuyin-primary-color)] p-4 chat-bubble ai w-72 rounded-2xl cp hover:scale-105 transition-all">
                    <p>我想学习关于机器学习的基础知识，有什么推荐的学习路径吗？</p>
                  </div>
                  <div
                      class="absolute top-48 left-0 bg-[var(--bg-video-card)] p-4 chat-bubble w-80 rounded-2xl cp hover:scale-105 transition-all">
                    <p class=" ">
                      当然可以！机器学习入门可以从Python编程和线性代数开始，然后学习基础算法如线性回归和决策树...</p>
                  </div>
                  <div
                      class="absolute top-72 right-0 bg-[var(--niuyin-primary-color)] p-4 chat-bubble ai w-64 rounded-2xl cp hover:scale-105 transition-all">
                    <p>太好了！能推荐一些具体的学习资源吗？</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- 功能亮点 -->
            <section class="mb-24">
              <h2 class="text-3xl font-bold text-center mb-4">核心功能</h2>
              <p class="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                我们的AI聊天助手拥有多项强大功能，为您提供卓越的对话体验
              </p>

              <div class="grid grid-cols-3 gap-8">
                <!-- 功能卡片1 -->
                <div
                    class="feature-card bg-[var(--bg-video-card)] p-8 rounded-xl shadow-md transition-all duration-300 border border-[var(--niuyin-border-color)] cp hover:scale-105">
                  <div class="text-blue-500 mb-4">
                    <i class="fas fa-comment-dots text-4xl"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-3">自然对话</h3>
                  <p class="text-gray-600">
                    采用最先进的自然语言处理技术，理解您的意图，提供流畅自然的对话体验，就像与真人交流一样。
                  </p>
                </div>

                <!-- 功能卡片2 -->
                <div
                    class="feature-card bg-[var(--bg-video-card)] p-8 rounded-xl shadow-md transition-all duration-300 border border-[var(--niuyin-border-color)] cp hover:scale-105">
                  <div class="text-blue-500 mb-4">
                    <i class="fas fa-brain text-4xl"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-3">多领域知识</h3>
                  <p class="text-gray-600">
                    覆盖科技、商业、教育、创意写作等多个领域，为您提供专业、准确的信息和建议。
                  </p>
                </div>

                <!-- 功能卡片3 -->
                <div
                    class="feature-card bg-[var(--bg-video-card)] p-8 rounded-xl shadow-md transition-all duration-300 border border-[var(--niuyin-border-color)] cp hover:scale-105">
                  <div class="text-blue-500 mb-4">
                    <i class="fas fa-bolt text-4xl"></i>
                  </div>
                  <h3 class="text-xl font-bold mb-3">快速响应</h3>
                  <p class="text-gray-600">
                    毫秒级的响应速度，无需等待，即时获取您需要的信息和答案，提高工作效率。
                  </p>
                </div>
              </div>
            </section>

            <!-- 使用场景 -->
            <section class="mb-24">
              <h2 class="text-3xl font-bold text-center mb-4">应用场景</h2>
              <p class="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                无论您是需要工作协助、学习辅导还是创意激发，我们的AI都能胜任
              </p>

              <div class="grid grid-cols-4 gap-6">
                <!-- 场景1 -->
                <div
                    class="bg-[var(--bg-video-card)] p-6 rounded-2xl shadow-sm border border-[var(--niuyin-border-color)] cp hover:scale-105 transition-all">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-laptop-code text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">编程辅助</h4>
                  <p class="text-sm text-gray-600">代码调试、算法解释、最佳实践建议</p>
                </div>

                <!-- 场景2 -->
                <div
                    class="bg-[var(--bg-video-card)] p-6 rounded-2xl shadow-sm border border-[var(--niuyin-border-color)] cp hover:scale-105 transition-all">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-book text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">学习辅导</h4>
                  <p class="text-sm text-gray-600">概念解释、学习计划、题目解答</p>
                </div>

                <!-- 场景3 -->
                <div
                    class="bg-[var(--bg-video-card)] p-6 rounded-2xl shadow-sm border border-[var(--niuyin-border-color)] cp hover:scale-105 transition-all">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-lightbulb text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">创意生成</h4>
                  <p class="text-sm text-gray-600">写作灵感、头脑风暴、内容创作</p>
                </div>

                <!-- 场景4 -->
                <div
                    class="bg-[var(--bg-video-card)] p-6 rounded-2xl shadow-sm border border-[var(--niuyin-border-color)] cp hover:scale-105 transition-all">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-briefcase text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">商业应用</h4>
                  <p class="text-sm text-gray-600">市场分析、商业计划、邮件撰写</p>
                </div>
              </div>
            </section>

            <!-- CTA区域 -->
            <section class="bg-[var(--bg-video-card)] from-blue-50 to-indigo-50 rounded-2xl p-12 text-center">
              <h2 class="text-3xl font-bold mb-4">准备好体验智能对话了吗？</h2>
              <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                立即注册，开启您的AI对话之旅。无需信用卡，免费试用我们的高级功能。
              </p>
              <button
                  @click="handleClickConversationExpand"
                  class="px-10 py-4 bg-[var(--niuyin-primary-color)] text-white rounded-full font-medium hover:bg-[var(--niuyin-primary-color-8)] transition-all shadow-lg hover:shadow-xl text-lg">
                开始免费试用
              </button>
            </section>
          </div>
        </el-scrollbar>
        <el-scrollbar v-else ref="scrollbarRef">
          <div ref="messageContainer" class="overflow-y-auto px-4 pt1rem">
            <div v-for="msg in messages" :key="msg.id" :class="[
                'flex gap-4 mb-6 opacity-0 animate-fade-in',
                msg.messageType === 'assistant' ? 'justify-start' : 'justify-end',
                { '!opacity-100': msg.status === MessageStatus.Streaming }
            ]">
              <div v-if="msg.messageType === 'assistant'"
                   class="cp flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--niuyin-primary-color-5)] shadow flex items-center justify-center"
                   style="border-radius: 50%">
                <img src="./assets/ai-bot.svg" alt="AI"/>
              </div>
              <div v-else-if="msg.messageType === 'user'"
                   class="cp flex-shrink-0 w-10 h-10 shadow flex items-center justify-center order-3"
                   style="border-radius: 50%">
                <el-avatar :src="userInfoX().userInfo?.avatar" :alt="userInfoX().userInfo?.nickName"/>
              </div>
              <div :class="[
                    'max-w-[80%] min-w-[200px]',
                    msg.messageType === 'assistant' ? 'order-1' : 'order-2'
                ]">
                <div class="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <span>{{ msg.messageType === 'assistant' ? 'AI' : userInfoX().userInfo?.nickName }}</span>
                  <span>{{ new Date(msg.createTime).toLocaleTimeString() }}</span>
                </div>
                <div :class="[
                        'p-4 rounded-xl shadow-sm whitespace-pre-wrap break-words',
                        msg.messageType === 'assistant'
                            ? 'bg-[var(--bg-video-card)] border border-[var(--niuyin-border-color)] text-[var(--niuyin-text-color)]'
                            : 'bg-[var(--niuyin-primary-color)] text-white rounded-tr-none'
                    ]"
                     style="overflow: auto">
                  <div v-if="msg.messageType === 'user'">
                    <div>
                      {{ msg.content }}
                    </div>

                  </div>
                  <div v-else-if="msg.messageType === 'assistant'">
                    <Typewriter :content="msg.content" :is-markdown="true"/>
                  </div>
                </div>
                <!-- 对话框下方操作栏 -->
                <div class="flex items-center mt-2">
                  <el-tooltip
                      content="复制"
                      placement="top">
                    <button
                        @click="handleCopyMessage(msg.id,msg.content)"
                        class="w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] border border-[var(--niuyin-border-color)] flex items-center justify-center text-gray-500 hover:text-green-900 transition-colors">
                      <Check v-if="copyFlag && copyMessageId===msg.id" theme="outline" size="16"/>
                      <Copy v-else theme="outline" size="16"/>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                      content="编辑"
                      v-if="msg.messageType === 'user'"
                      placement="top">
                    <button
                        @click="handleClickMessageEdit(msg.id,msg.content)"
                        class="ml-2 w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] border border-[var(--niuyin-border-color)] flex items-center justify-center text-gray-500 hover:text-blue-900 transition-colors">
                      <EditTwo theme="outline" size="16"></EditTwo>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                      content="重新生成"
                      v-if="msg.messageType === 'assistant'"
                      placement="top">
                    <button
                        class="ml-2 w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] border border-[var(--niuyin-border-color)] flex items-center justify-center text-gray-500 hover:text-blue-900 transition-colors">
                      <Refresh theme="outline" size="16"></Refresh>
                    </button>
                  </el-tooltip>
                  <!--                  <button-->
                  <!--                      class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">-->
                  <!--                    <i class="fas fa-download"></i>-->
                  <!--                  </button>-->
                  <el-tooltip
                      v-if="msg.messageType === 'assistant'"
                      content="喜欢"
                      placement="top">
                    <button
                        class="ml-2 w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] border border-[var(--niuyin-border-color)] flex items-center justify-center text-gray-500 hover:text-red-900 transition-colors">
                      <ThumbsUp theme="outline" size="16"/>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                      v-if="msg.messageType === 'assistant'"
                      content="不喜欢"
                      placement="top">
                    <button
                        class="ml-2 w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] border border-[var(--niuyin-border-color)] flex items-center justify-center text-gray-500 hover:text-yellow-900 transition-colors">
                      <ThumbsDown theme="outline" size="16"/>
                    </button>
                  </el-tooltip>
                  <el-popconfirm
                      title="确认删除该条消息？"
                      placement="top"
                      @confirm="handleDeleteMessage(msg.id)">
                    <template #reference>
                      <button
                          class="ml-2 w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] border border-[var(--niuyin-border-color)] flex items-center justify-center text-gray-500 hover:text-red-900 transition-colors">
                        <Delete theme="outline" size="16"/>
                      </button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <!-- 输入区域 -->
        <div class="border-t border-[var(--niuyin-border-color)] p-4">
          <div class="max-w-4xl mx-auto">
            <div class="relative">
              <textarea
                  class="w-full fs1rem px-3 py-2 border border-[var(--niuyin-border-color)] rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--niuyin-primary-color)] focus:border-[var(--niuyin-primary-color)] disabled:opacity-50"
                  rows="2"
                  placeholder="输入您的消息或指令..."
                  @keyup.enter="sendMessage"
                  ref="inputRef"
                  style="min-height: 74px"
                  v-model="inputMessage"
                  :disabled="isLoading"></textarea>
              <div class="absolute right-3 bottom-3 flex gap-2">
                <button
                    class="w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] flex items-center justify-center text-gray-500 transition-colors">
                  <i class="fas fa-microphone"></i>
                </button>
                <button
                    class="w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] flex items-center justify-center text-gray-500 transition-colors">
                  <i class="fas fa-image"></i>
                </button>
                <button
                    class="w-8 h-8 rounded-full bg-[var(--niuyin-primary-color)] hover:bg-[var(--niuyin-primary-color-8)] flex items-center justify-center text-white transition-colors"
                    :class="{ 'bg-red-500 hover:bg-red-600': isLoading }"
                    @click="sendMessage">
                  <i v-if="isLoading" @click="stopGeneration" class="fas fa-pause"/>
                  <i v-else class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="max-w-4xl mx-auto flex flex-between gap-2 mt-4">
            <div class="text-xs text-gray-500 flex-row">
              <button
                  class="w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] flex items-center justify-center text-gray-500 transition-colors"
                  @click="handleClickConversationExpand">
                <i class="fas fa-archive"/>
              </button>
              <div class="mx-4">
                AI助手 1.0-Beta • 联网搜索已开启
              </div>
            </div>
            <div class="text-xs text-gray-500">
              <el-button type="text" class="hover:text-gray-700"><i class="fas fa-magic mr-1"/>快捷指令</el-button>
              <span class="mx-2">•</span>
              <el-button type="text" class="hover:text-gray-700"><i class="fas fa-cog mr-1"/>设置</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fade-in {
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease forwards;
}

.title-color-white h3 {
  color: white;
}
</style>
