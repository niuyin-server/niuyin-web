<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, reactive, ref} from 'vue'
import {fetchEventSource} from '@microsoft/fetch-event-source'
import {listConversation} from "@/api/ai/chat/conversation";
import {listMessageByCid} from "@/api/ai/chat/message";

// 请求体
const requestBody = reactive({
  pageNum: 1,
  pageSize: 20
})

const conversationList = ref<any[]>()
const conversationListLoading = ref<boolean>(true) //0为空1为请求失败
const conversationListTotal = ref<number>(0)
const conversationListGroups = ref<any>({
  today: [],
  yesterday: [],
  lastWeek: [],
  lastMonth: [],
  lastYear: [],
  older: [],
})
const selectedConversationId = ref<string>('')

type GroupKey = 'today' | 'yesterday' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'older'
const getGroupTitle = (group: GroupKey): string => {
  const titles: Record<GroupKey, string> = {
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
      // 处理对话，分组
      handleConversationGroup()
      conversationListLoading.value = false
    } else {

    }
  })
}

/**
 * 处理对话，分组
 */
const handleConversationGroup = () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const lastWeekStart = new Date(todayStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastMonthStart = new Date(todayStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
  const lastYearStart = new Date(todayStart);
  lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
  // 将对话列表分组
  conversationList.value?.forEach(conversation => {
    const convDate = new Date(conversation.createTime);

    if (convDate >= todayStart) {
      conversationListGroups.value.today.push(conversation);
    } else if (convDate >= yesterdayStart) {
      conversationListGroups.value.yesterday.push(conversation);
    } else if (convDate >= lastWeekStart) {
      conversationListGroups.value.lastWeek.push(conversation);
    } else if (convDate >= lastMonthStart) {
      conversationListGroups.value.lastMonth.push(conversation);
    } else if (convDate >= lastYearStart) {
      conversationListGroups.value.lastYear.push(conversation);
    } else {
      conversationListGroups.value.older.push(conversation);
    }
  })
}

const handleSelectConversation = (id: string) => {
  selectedConversationId.value = id
  // 请求消息列表
  listMessageByCid({cid: selectedConversationId.value}).then(res => {
    if (res?.code === 200) {
      messages.value = res?.data
    } else {

    }
  })
}

// 格式化相对时间
const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diffInSeconds < minute) {
    return '刚刚';
  } else if (diffInSeconds < hour) {
    return `${Math.floor(diffInSeconds / minute)}分钟前`;
  } else if (diffInSeconds < day) {
    return `${Math.floor(diffInSeconds / hour)}小时前`;
  } else if (diffInSeconds < week) {
    return `${Math.floor(diffInSeconds / day)}天前`;
  } else if (diffInSeconds < month) {
    return `${Math.floor(diffInSeconds / week)}周前`;
  } else if (diffInSeconds < year) {
    return `${Math.floor(diffInSeconds / month)}个月前`;
  } else {
    return `${Math.floor(diffInSeconds / year)}年前`;
  }
};

// 生成随机用户ID（示例：8位字母数字组合）
const generateUserId = () => {
  return Math.random().toString(36).substr(2, 8);
};

// 持久化存储用户ID
const userId = ref('');

enum MessageStatus {
  Streaming = 'streaming',
  Complete = 'complete',
  Error = 'error',
}

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: number

  conversationId: string
  messageType: string
  createBy: string
  createTime: string
  delFlag: string
  replayId: string
  updateBy: string
  updateTime: string
  useContext: string
  userId: string
}

const messages = ref<Message[]>([
  {
    id: 'user-1',
    content: '你好',
    isBot: false,
    timestamp: Date.now(),

    conversationId: '1',
    messageType: 'user',
    createBy: '1',
    createTime: '2023-07-01 12:00:00Z',
    delFlag: '0',
    replayId: '0',
    updateBy: '1',
    updateTime: '2023-07-01 12:00:00Z',
    useContext: '0',
    userId: '1'
  },
  {
    id: 'bot-1',
    content: '你好，有什么可以帮到你的吗？',
    isBot: true,
    timestamp: Date.now(),

    conversationId: '1',
    messageType: 'assistant',
    createBy: '1',
    createTime: '2023-07-01 12:00:00Z',
    delFlag: '0',
    replayId: '0',
    updateBy: '1',
    updateTime: '2023-07-01 12:00:00Z',
    useContext: '0',
    userId: '1'
  }
])
const inputMessage = ref('')
const isLoading = ref(false)
const controller = ref<AbortController>()
const messageContainer = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

// 自动滚动控制
let autoScroll = true
let lastCharType: 'chinese' | 'english' | 'other' = 'other'

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value && autoScroll) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const handleScroll = () => {
  if (!messageContainer.value) return
  const {scrollTop, scrollHeight, clientHeight} = messageContainer.value
  autoScroll = scrollHeight - (scrollTop + clientHeight) < 50
}

// 字符类型检测
const getCharType = (char: string): 'chinese' | 'english' | 'other' => {
  if (/[\u4e00-\u9fa5\u3000-\u303F\uFF00-\uFFEF]/.test(char)) {
    return 'chinese'
  }
  if (/[a-zA-Z]/.test(char)) {
    return 'english'
  }
  return 'other'
}

// 智能空格处理核心逻辑
const processContent = (prev: string, newData: string): string => {
  if (prev.length === 0) return newData

  const lastChar = prev.slice(-1)
  const newFirstChar = newData[0] || ''

  const prevType = getCharType(lastChar)
  const newType = getCharType(newFirstChar)

  let processed = newData

  // 需要添加空格的情况
  const shouldAddSpace =
      (prevType === 'english' && newType === 'english') || // 英文接英文
      (prevType === 'chinese' && newType === 'english') || // 中文接英文
      (prevType === 'english' && newType === 'chinese' && !/[!?,.]$/.test(lastChar)) // 英文接中文（非标点结尾）

  // 需要删除空格的情况
  const shouldRemoveSpace =
      (prevType === 'chinese' && newType === 'chinese') || // 中文接中文
      (prevType === 'other' && /^[\u4e00-\u9fa5]/.test(newData)) // 特殊符号接中文

  if (shouldAddSpace && !lastChar.match(/\s/) && !newFirstChar.match(/\s/)) {
    processed = ' ' + processed
  } else if (shouldRemoveSpace) {
    processed = processed.replace(/^\s+/, '')
  }

  return processed
}

const sendChatRequest = async (content: string, botMessage: Message) => {
  controller.value = new AbortController()

  await fetchEventSource('http://localhost:9101/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'X-Content-Lang': 'zh-CN'
    },
    body: JSON.stringify({message: content, userId: userId.value}),
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

      // 更新最后字符类型
      const lastChar = processedData.slice(-1)
      lastCharType = getCharType(lastChar)

      scrollToBottom()
    },

    onerror: err => {
      throw err
    }
  })
}

// 错误处理
const handleRequestError = (botMessage: Message, error: unknown) => {
  const errorMessage = error instanceof Error
      ? navigator.onLine
          ? error.message
          : '网络连接不可用'
      : '请求发生未知错误'

  botMessage.status = MessageStatus.Error
  botMessage.content = errorMessage
  // botMessage.retry = createRetryHandler(botMessage.content)
}

// 主发送逻辑
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userContent = inputMessage.value.trim()
  inputMessage.value = ''

  // 创建用户消息
  const userMessage = reactive<Message>({
    id: `user-${Date.now()}`,
    content: userContent,
    isBot: false,
    timestamp: Date.now()
  })
  messages.value.push(userMessage)

  // 创建机器人消息
  const botMessage = reactive<Message>({
    id: `bot-${Date.now()}`,
    content: '',
    isBot: true,
    status: MessageStatus.Streaming,
    timestamp: Date.now()
  })
  messages.value.push(botMessage)

  isLoading.value = true

  try {
    await sendChatRequest(userContent, botMessage)
  } catch (err) {
    handleRequestError(botMessage, err)
  } finally {
    isLoading.value = false
    nextTick(() => inputRef.value?.focus())
  }
}

// 停止生成
const stopGeneration = () => {
  controller.value?.abort()
  isLoading.value = false
}

// 生命周期
onMounted(() => {
  userId.value = localStorage.getItem('chatUserId') || generateUserId();
  localStorage.setItem('chatUserId', userId.value);
  messageContainer.value?.addEventListener('scroll', handleScroll)
  inputRef.value?.focus()
  getConversationList()
})

onBeforeUnmount(() => {
  messageContainer.value?.removeEventListener('scroll', handleScroll)
  controller.value?.abort()
})
</script>

<template>
  <div class="flex flex-1" style="flex-direction: row">
    <div class="flex flex-col w-64 border-r border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <button
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <i class="fas fa-plus"></i>
          <span>新对话</span>
        </button>
      </div>

      <el-scrollbar>
        <div class="flex-1 overflow-y-auto">
          <div class="px-4 pb-2">
            <el-skeleton :loading="conversationListLoading" animated>
              <template #template>
                <div v-for="i in 3" class="space-y-4 mb-6">
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
                       class="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border hover:border-gray-400 transition-all mb-2"
                       :class="selectedConversationId === conversation.id ? 'bg-blue-100 border-blue-200' : 'border-gray-200'">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-800 truncate">{{ conversation.title }}</h3>
                      <span class="text-xs text-gray-500">{{ formatRelativeTime(conversation.updateTime) }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 truncate">{{ conversation.preview || '......' }}</p>
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </div>

      </el-scrollbar>
    </div>
    <div class="flex flex-1 flex-col">

      <!-- 聊天内容区域 -->
      <div class="flex flex-1 flex-col oh bg-gradient-to-b to-gray-50">
        <el-scrollbar>
          <div ref="messageContainer" class="overflow-y-auto px-4 pt1rem">
            <div v-for="msg in messages" :key="msg.id" :class="[
                'flex gap-4 mb-6 opacity-0 animate-fade-in',
                msg.isBot ? 'justify-start' : 'justify-end',
                { '!opacity-100': msg.status === MessageStatus.Streaming }
            ]">
              <div v-if="msg.isBot"
                   class="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-500" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>

              <div :class="[
                    'max-w-[70%] min-w-[200px]',
                    msg.isBot ? 'order-1' : 'order-2'
                ]">
                <div class="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <span>{{ msg.isBot ? 'Spring AI' : '我' }}</span>
                  <span>{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
                </div>
                <div :class="[
                        'p-4 rounded-xl shadow-sm whitespace-pre-wrap break-words',
                        msg.isBot
                            ? 'bg-white border border-gray-200 text-gray-800'
                            : 'bg-blue-500 text-white rounded-tr-none'
                    ]">
                  <template v-if="msg.status === MessageStatus.Streaming">
                    <div v-if="msg.content" class="mb-2">{{ msg.content }}</div>
                    <div class="flex gap-1 mt-2">
                      <span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style="animation-delay: 0.2s"></span>
                      <span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style="animation-delay: 0.4s"></span>
                      <span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style="animation-delay: 0.6s"></span>
                    </div>
                  </template>
                  <div v-else>{{ msg.content }}</div>
                </div>
              </div>

              <div v-if="!msg.isBot"
                   class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 shadow flex items-center justify-center order-3">
                <svg class="w-6 h-6 text-blue-500" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <!-- 输入区域 -->
        <div class="border-t border-gray-200 p-4">
          <div class="max-w-4xl mx-auto flex gap-2">
            <input
                ref="inputRef"
                v-model="inputMessage"
                @keyup.enter="sendMessage"
                placeholder="输入消息..."
                :disabled="isLoading"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50"
            />
            <button
                @click="sendMessage"
                :disabled="isLoading"
                class="px-5 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading">发送中...</span>
              <span v-else>发送</span>
            </button>
            <button
                v-if="isLoading"
                @click="stopGeneration"
                class="px-5 py-3 bg-red-500 text-white rounded-xl font-medium"
            >
              停止
            </button>
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
</style>
