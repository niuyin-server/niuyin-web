<template>
    <div class="flex flex-col wh100 b-radius1 overflow-hidden">
        <header class="w-full h-[60px] border-b border-gray-100 flex items-center px-6 justify-between">
            <div class="flex items-center gap-3">
                <el-icon class="text-blue-500 text-xl">
                    <ChatRound />
                </el-icon>
                <h1 class="text-lg font-medium">AI 智能助手</h1>
            </div>
            <div class="flex items-center gap-4">
                <el-button type="text" class="!rounded-button">
                    <el-icon :size="16">
                        <Setting />
                    </el-icon>
                </el-button>
            </div>
        </header>
        <div class="flex flex-1 relative overflow-hidden">
            <!-- 会话列表 -->
            <div class="w-[300px] border-r border-gray-100 transition-all duration-300 ease-in-out transform h-full absolute z-10"
                :class="showChatList ? 'translate-x-0' : '-translate-x-[300px]'">
                <div class="p-4 space-y-4">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-lg font-medium">会话列表</h2>
                        <el-button type="primary" class="!rounded-button" @click="createNewChat">
                            <el-icon class="mr-1">
                                <Plus />
                            </el-icon>
                            新建会话
                        </el-button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="chat in chatList" :key="chat.id"
                            class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                            :class="{ 'bg-blue-50': currentChatId === chat.id }" @click="switchChat(chat.id)">
                            <div class="flex items-center gap-2 flex-1 min-w-0">
                                <el-icon>
                                    <ChatRound />
                                </el-icon>
                                <span class="truncate">{{ chat.title }}</span>
                            </div>
                            <el-button v-if="chatList.length > 1" type="text" class="!rounded-button"
                                @click.stop="deleteChat(chat.id)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 flex flex-col overflow-hidden" :class="{ 'ml-[300px]': showChatList }"
                style="transition: .3s all">
                <!-- 聊天区域 -->
                <main ref="chatContainer" class="flex-1 overflow-y-auto px-4 py-6" @scroll="handleScroll">
                    <div class="max-w-4xl mx-auto space-y-6">
                        <div v-for="(msg, index) in messages" :key="index" class="flex"
                            :class="msg.type === 'user' ? 'justify-end' : 'justify-start'">
                            <div class="max-w-[88%] flex items-start gap-3"
                                :class="msg.type === 'user' ? 'flex-row-reverse' : ''">
                                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <img :src="msg.type === 'user' ? userAvatar : aiAvatar" :alt="msg.type"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div class="message-bubble"
                                    :class="msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'">
                                    {{ msg.content }}
                                </div>
                            </div>
                        </div>
                        <div v-if="isTyping" class="flex justify-start">
                            <div class="max-w-[88%] flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <img :src="aiAvatar" alt="ai" class="w-full h-full object-cover" />
                                </div>
                                <div class="message-bubble bg-white text-gray-800">
                                    <div class="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- 输入区域 -->
                <footer class="border-t border-gray-100 p-4">
                    <div class="max-w-4xl mx-auto flex items-end gap-4">
                        <el-button type="text" class="!rounded-button" @click="showChatList = !showChatList">
                            <el-icon class="text-xl">
                                <Files />
                            </el-icon>
                        </el-button>
                        <el-input v-model="inputMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }"
                            placeholder="请输入您的问题..." resize="none" class="flex-1 !rounded-button"
                            @keyup.enter.exact.prevent="sendMessage" />
                        <el-button v-if="!isReceiving" type="primary" :disabled="!inputMessage.trim()"
                            class=" !rounded-button whitespace-nowrap" @click="sendMessage">
                            发送
                            <el-icon class="ml-1" :size="16">
                                <Position />
                            </el-icon>
                        </el-button>
                        <el-button v-else type="danger" class=" !rounded-button whitespace-nowrap"
                            @click="stopReceiving">
                            <el-icon :size="16">
                                <VideoPause />
                            </el-icon>
                        </el-button>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
    ChatRound,
    Setting,
    Position,
    VideoPause,
    Files,
    Delete,
    Plus,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const showChatList = ref(false);
const inputMessage = ref("");
const isTyping = ref(false);
const isReceiving = ref(false);
const chatContainer = ref < HTMLElement | null > null;
const userAvatar =
    "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/07/4eb4963fa6bb4f85aa0ba1f748978993.jpeg";
const aiAvatar =
    "https://public.readdy.ai/ai/img_res/ce5e827dc0be17269a8c7efd4050aba6.jpg";
const currentChatId = ref(1);
const chatList = ref([
    {
        id: 1,
        title: "默认会话",
        messages: [
            {
                type: "ai",
                content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
            },
        ],
    },
]);
const messages = ref(chatList.value[0].messages);
const createNewChat = () => {
    const newChat = {
        id: chatList.value.length + 1,
        title: `新会话 ${chatList.value.length + 1}`,
        messages: [
            {
                type: "ai",
                content: "你好！我是你的AI助手，有什么我可以帮你的吗？",
            },
        ],
    };
    chatList.value.push(newChat);
    switchChat(newChat.id);
};
const switchChat = (chatId) => {
    currentChatId.value = chatId;
    const chat = chatList.value.find((c) => c.id === chatId);
    if (chat) {
        messages.value = chat.messages;
        nextTick(() => {
            scrollToBottom();
        });
    }
};
const deleteChat = (chatId) => {
    if (chatList.value.length === 1) {
        ElMessage.warning("至少保留一个会话");
        return;
    }
    const index = chatList.value.findIndex((c) => c.id === chatId);
    if (index > -1) {
        chatList.value.splice(index, 1);
        if (currentChatId.value === chatId) {
            switchChat(chatList.value[0].id);
        }
    }
};
const scrollToBottom = async () => {
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};
const simulateAIResponse = async () => {
    isTyping.value = true;
    isReceiving.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    isTyping.value = false;
    const responses = [
        "我明白你的问题，让我来帮你分析一下。",
        "这是一个很好的问题，根据我的理解...",
        "我可以从几个方面为你解答这个问题。",
        "这个问题比较复杂，让我详细解释一下。",
    ];
    const currentChat = chatList.value.find((c) => c.id === currentChatId.value);
    if (currentChat) {
        currentChat.messages.push({
            type: "ai",
            content: responses[Math.floor(Math.random() * responses.length)],
        });
    }
    isReceiving.value = false;
    await scrollToBottom();
};
let eventSource = null;

const connectSSE = async (userId, message) => {
    if (eventSource) {
        eventSource.close();
    }

    try {
        const response = await fetch('http://localhost:9101/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({ userId, message })
        });

        if (!response.ok) throw new Error('连接失败');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let aiMessage = { type: 'ai', content: '' };

        // 先添加AI消息占位
        const currentChat = chatList.value.find((c) => c.id === currentChatId.value);
        if (currentChat) {
            currentChat.messages.push(aiMessage);
            await scrollToBottom();
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // 处理可能的多条消息
            const lines = buffer.split('\n\n');
            buffer = lines.pop(); // 保留未完成的部分

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.substring(6));

                    if (currentChat) {
                        if (data.type === 'partial') {
                            aiMessage.content += data.content;
                            await scrollToBottom();
                        } else if (data.type === 'complete') {
                            isReceiving.value = false;
                            isTyping.value = false;
                        }
                    }
                }
            }
        }
    } catch (error) {
        isReceiving.value = false;
        isTyping.value = false;
        ElMessage.error(error.message);
    }
};

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});

// 修改sendMessage函数
const sendMessage = async () => {
    const message = inputMessage.value.trim();
    if (!message) return;

    const currentChat = chatList.value.find((c) => c.id === currentChatId.value);
    if (currentChat) {
        currentChat.messages.push({
            type: "user",
            content: message,
        });
        // 更新会话标题
        if (currentChat.messages.length === 2) {
            currentChat.title = message.slice(0, 20) + (message.length > 20 ? "..." : "");
        }
    }

    inputMessage.value = "";
    isReceiving.value = true;
    isTyping.value = true;

    await scrollToBottom();
    connectSSE('current_user_id', message); // 替换为实际的用户ID
};

// 修改stopReceiving函数
const stopReceiving = () => {
    if (eventSource) {
        eventSource.close();
    }
    isReceiving.value = false;
    isTyping.value = false;
};

// 删除simulateAIResponse函数
const handleScroll = () => {
    if (!chatContainer.value) return;
    const { scrollTop } = chatContainer.value;
    // 当滚动到顶部时，可以加载更多历史消息
    if (scrollTop === 0) {
        // 这里可以添加加载更多历史消息的逻辑
    }
};
onMounted(() => {
    scrollToBottom();
});
</script>


<style scoped>
.message-bubble {
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    white-space: pre-wrap;
    word-break: break-word;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 4px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.4s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.6s;
}

@keyframes typing {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}
</style>