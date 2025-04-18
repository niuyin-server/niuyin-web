<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

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
    status?: MessageStatus
    timestamp: number
    retry?: () => Promise<void>
}

const messages = ref<Message[]>([])
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
    const { scrollTop, scrollHeight, clientHeight } = messageContainer.value
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
        body: JSON.stringify({ message: content, userId: userId.value }),
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
})

onBeforeUnmount(() => {
    messageContainer.value?.removeEventListener('scroll', handleScroll)
    controller.value?.abort()
})
</script>

<template>
    <div class="flex flex-col h-full w-full bg-gray-50">
        <!-- 顶部标题栏 -->
        <header class="bg-blue-500 text-white shadow-sm py-4 px-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <h1 class="text-xl font-semibold">芝士学爆智能客服</h1>
            </div>
        </header>

        <!-- 聊天内容区域 -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
            <div v-for="msg in messages" :key="msg.id" :class="[
                'flex gap-4 mb-6 opacity-0 animate-fade-in',
                msg.isBot ? 'justify-start' : 'justify-end',
                { '!opacity-100': msg.status === MessageStatus.Streaming }
            ]">
                <div v-if="msg.isBot" class="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
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
                                <span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.2s"></span>
                                <span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.4s"></span>
                                <span class="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0.6s"></span>
                            </div>
                        </template>
                        <div v-else>{{ msg.content }}</div>
                    </div>
                </div>

                <div v-if="!msg.isBot" class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 shadow flex items-center justify-center order-3">
                    <svg class="w-6 h-6 text-blue-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="bg-white border-t border-gray-200 p-4">
            <div class="max-w-4xl mx-auto flex gap-2">
                <input 
                    ref="inputRef" 
                    v-model="inputMessage" 
                    @keyup.enter="sendMessage" 
                    placeholder="输入消息..." 
                    :disabled="isLoading"
                    class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
</template>
 

<style>
@keyframes fade-in {
    to { opacity: 1; }
}
.animate-fade-in {
    animation: fade-in 0.3s ease forwards;
}
</style>
