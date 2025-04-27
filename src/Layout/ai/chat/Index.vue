<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, reactive, ref} from 'vue'
import {fetchEventSource} from '@microsoft/fetch-event-source'
import {addConversation, listConversation} from "@/api/ai/chat/conversation";
import {listMessageByCid} from "@/api/ai/chat/message";
import {userInfoX} from "@/store/userInfoX";
import {MoreFilled} from "@element-plus/icons-vue";
import {ElMessage, ScrollbarInstance} from 'element-plus'
import {Typewriter} from 'vue-element-plus-x'
import {Copy, Check, Refresh, ThumbsUp, ThumbsDown} from '@icon-park/vue-next'
import {parseTime} from "@/utils/roydon";

const scrollbarRef = ref<ScrollbarInstance>()
const max = ref(0)

// 请求体
const requestBody = reactive({
  pageNum: 1,
  pageSize: 20
})
const conversationExpand = ref<boolean>(false)
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
const getGroupTitle = (group: any): string => {
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
  if (selectedConversationId.value === id) {
    return
  }
  selectedConversationId.value = id
  // 清空消息列表
  messages.value = []
  // 输入框focus
  inputRef.value?.focus()
  // 请求消息列表
  listMessageByCid({cid: selectedConversationId.value}).then(res => {
    if (res?.code === 200) {
      messages.value = res?.data
      // 滑动到对话底部
      nextTick(() => {
        max.value = messageContainer.value!.clientHeight
        console.log('max', max.value)
        scrollbarRef.value!.setScrollTop(max.value)
      })
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
  status: MessageStatus
  conversationId: string
  messageType: string
  createTime: string
  replayId: string
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
    status: MessageStatus.Complete,
    conversationId: '1',
    messageType: 'user',
    createTime: '2023-07-01 12:00:00Z',
    replayId: '0',
    updateTime: '2023-07-01 12:00:00Z',
    useContext: '0',
    userId: '1'
  },
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
])
const inputMessage = ref('')
const isLoading = ref(false)
const controller = ref<AbortController>()
const messageContainer = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

// 监听消息列表的变化，并自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      max.value = messageContainer.value!.clientHeight
      scrollbarRef.value!.setScrollTop(max.value)
    }
  })
}

// const handleScroll = () => {
//   if (!messageContainer.value) return
//   const {scrollTop, scrollHeight, clientHeight} = messageContainer.value
//   autoScroll = scrollHeight - (scrollTop + clientHeight) < 50
// }

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

const sendChatRequest = async (conversationId: string, content: string, botMessage: Message) => {
  controller.value = new AbortController()

  await fetchEventSource('http://localhost:9101/chat/stream', {
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

      // 更新最后字符类型
      // const lastChar = processedData.slice(-1)
      // lastCharType = getCharType(lastChar)

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

  if (!selectedConversationId.value) {
    // 先创建对话？？
    await addConversation({title: userContent}).then(res => {
      if (res?.code === 200) {
        // 插入对话列表
        conversationListGroups.value.today.unshift(res.data)
        selectedConversationId.value = res.data.id
      } else {
        ElMessage.error('创建对话失败')
        return
      }
    })
  }
  const createTime = parseTime(Date.now())
  // 创建用户消息
  const userMessage = reactive<Message>({
    id: `user-${Date.now()}`,
    content: userContent,
    isBot: false,
    timestamp: Date.now(),
    status: MessageStatus.Complete,
    conversationId: selectedConversationId.value,
    messageType: 'user',
    // 设置 yyyy-MM-dd HH:mm:ss 类型的当前时间
    createTime: createTime,
    replayId: '',
    updateTime: createTime,
    useContext: '1',
    userId: userInfoX().userInfo?.userId
  })
  messages.value.push(userMessage)

  // 创建机器人消息
  const botMessage = reactive<Message>({
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
  // 移动scroller
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

// 停止生成
const stopGeneration = () => {
  controller.value?.abort()
  isLoading.value = false
}
const handleClickConversationMore = (id) => {
  // 显示更多对话框
  console.log(id)
}
const handleDeleteConversation = (id) => {
  // 删除对话
  console.log(id)
}
const handleEditConversation = (id) => {
  // 编辑对话
  console.log(id)
}

// 展开/折叠对话列表
const handleClickConversationExpand = () => {
  conversationExpand.value = !conversationExpand.value
}

// 创建新对话
const handleCreateNewConversation = () => {
  // 创建新对话
  addConversation({title: '新对话'}).then(res => {
    if (res?.code === 200) {
      // 插入对话列表
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

const copyFlag = ref(false)
const copyMessageId = ref<string>('')

const handleCopyMessage = async (id: string, message: string) => {
  // 复制到粘贴板
  try {
    await navigator.clipboard.writeText(message)
    copyFlag.value = true
    copyMessageId.value = id
    setTimeout(() => {
      copyFlag.value = false
    }, 2000)
  } catch (err) {
  }
}

onMounted(() => {
  // messageContainer.value?.addEventListener('scroll', handleScroll)
  inputRef.value?.focus()
  getConversationList()
})

onBeforeUnmount(() => {
  // messageContainer.value?.removeEventListener('scroll', handleScroll)
  controller.value?.abort()
})
</script>

<template>
  <div class="flex flex-1" style="flex-direction: row">
    <div v-if="conversationExpand" class="flex flex-col w-64 border-r border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <button
            @click="handleCreateNewConversation"
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
                       class="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border hover:border-gray-400 transition-all mb-2"
                       :class="selectedConversationId === conversation.id ? 'bg-blue-100 border-blue-200' : 'border-gray-200'">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-800 truncate">{{ conversation.title }}</h3>
                      <span class="text-xs text-gray-500">{{ formatRelativeTime(conversation.updateTime) }}</span>
                    </div>
                    <div class="flex-row flex-between mt-1 flex-nowrap">
                      <p v-if="conversation.lastMessage" class="text-xs text-gray-500 mt-1 truncate">
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
                                class="text-sm border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                                @click="handleEditConversation(conversation.id)">
                              <i class="fas fa-italic text-gray-500"></i>
                              <span class="fs8">重命名</span>
                            </button>
                            <button
                                class="mt-2 text-sm border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                                @click="handleDeleteConversation(conversation.id)">
                              <i class="fas fa-trash-alt text-gray-500"></i>
                              <span class="fs8">删除</span>
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
      </el-scrollbar>

    </div>
    <div class="flex flex-1 flex-col">

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
                      class="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-md hover:shadow-lg">
                    立即体验
                  </button>
                  <button
                      class="px-8 py-3 border border-blue-500 text-blue-500 rounded-full font-medium hover:bg-blue-50 transition-all">
                    观看演示
                  </button>
                </div>
              </div>
              <div class="w-1/2 flex justify-center">
                <div class="relative w-96 h-96">
                  <!-- 聊天气泡示例 -->
                  <div class="absolute top-0 left-0 bg-blue-100 p-4 chat-bubble w-64 rounded-2xl">
                    <p class="text-gray-800">你好！今天有什么我可以帮助你的吗？</p>
                  </div>
                  <div class="absolute top-24 right-0 bg-blue-500 text-white p-4 chat-bubble ai w-72 rounded-2xl">
                    <p>我想学习关于机器学习的基础知识，有什么推荐的学习路径吗？</p>
                  </div>
                  <div class="absolute top-48 left-0 bg-blue-100 p-4 chat-bubble w-80 rounded-2xl">
                    <p class="text-gray-800">
                      当然可以！机器学习入门可以从Python编程和线性代数开始，然后学习基础算法如线性回归和决策树...</p>
                  </div>
                  <div class="absolute top-72 right-0 bg-blue-500 text-white p-4 chat-bubble ai w-64 rounded-2xl">
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
                    class="feature-card bg-white p-8 rounded-xl shadow-md transition-all duration-300 border border-gray-100">
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
                    class="feature-card bg-white p-8 rounded-xl shadow-md transition-all duration-300 border border-gray-100">
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
                    class="feature-card bg-white p-8 rounded-xl shadow-md transition-all duration-300 border border-gray-100">
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
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-laptop-code text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">编程辅助</h4>
                  <p class="text-sm text-gray-600">代码调试、算法解释、最佳实践建议</p>
                </div>

                <!-- 场景2 -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-book text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">学习辅导</h4>
                  <p class="text-sm text-gray-600">概念解释、学习计划、题目解答</p>
                </div>

                <!-- 场景3 -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-lightbulb text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">创意生成</h4>
                  <p class="text-sm text-gray-600">写作灵感、头脑风暴、内容创作</p>
                </div>

                <!-- 场景4 -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div class="text-blue-500 mb-3">
                    <i class="fas fa-briefcase text-2xl"></i>
                  </div>
                  <h4 class="font-semibold mb-2">商业应用</h4>
                  <p class="text-sm text-gray-600">市场分析、商业计划、邮件撰写</p>
                </div>
              </div>
            </section>

            <!-- CTA区域 -->
            <section class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 text-center">
              <h2 class="text-3xl font-bold mb-4">准备好体验智能对话了吗？</h2>
              <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
                立即注册，开启您的AI对话之旅。无需信用卡，免费试用我们的高级功能。
              </p>
              <button
                  class="px-10 py-4 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl text-lg">
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
                   class="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-500" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>

              <div :class="[
                    'max-w-[80%] min-w-[200px]',
                    msg.messageType === 'assistant' ? 'order-1' : 'order-2'
                ]">
                <div class="flex items-center gap-2 mb-2 text-sm text-gray-500">
                  <span>{{ msg.messageType === 'assistant' ? 'AI' : '我' }}</span>
                  <span>{{ new Date(msg.createTime).toLocaleTimeString() }}</span>
                </div>
                <div :class="[
                        'p-4 rounded-xl shadow-sm whitespace-pre-wrap break-words',
                        msg.messageType === 'assistant'
                            ? 'bg-white border border-gray-200 text-gray-800'
                            : 'bg-blue-500 text-white rounded-tr-none'
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
                        class="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-green-900 transition-colors">
                      <Check v-if="copyFlag && copyMessageId===msg.id" theme="outline" size="16"/>
                      <Copy v-else theme="outline" size="16"/>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                      content="重新生成"
                      v-if="msg.messageType === 'assistant'"
                      placement="top">
                    <button
                        class="ml-2 w-8 h-8 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-900 transition-colors">
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
                        class="ml-2 w-8 h-8 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-red-900 transition-colors">
                      <ThumbsUp theme="outline" size="16"/>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                      v-if="msg.messageType === 'assistant'"
                      content="不喜欢"
                      placement="top">
                    <button
                        class="ml-2 w-8 h-8 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-yellow-900 transition-colors">
                      <ThumbsDown theme="outline" size="16"/>
                    </button>
                  </el-tooltip>
                </div>
              </div>

              <div v-if="msg.messageType === 'user'"
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
          <div class="max-w-4xl mx-auto">
            <div class="relative">
              <textarea
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50"
                  rows="2"
                  placeholder="输入您的消息或指令..."
                  @keyup.enter="sendMessage"
                  ref="inputRef"
                  style="min-height: 74px"
                  v-model="inputMessage"
                  :disabled="isLoading"></textarea>
              <div class="absolute right-3 bottom-3 flex gap-2">
                <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                  <i class="fas fa-microphone"></i>
                </button>
                <button
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                  <i class="fas fa-image"></i>
                </button>
                <button
                    class="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
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
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
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
</style>
