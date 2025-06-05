import request from '@/utils/request.js'
import {fetchEventSource} from "@microsoft/fetch-event-source";

// 对话消息列表
export function listMessageByCid(param) {
    return request({
        url: '/ai/web-api/api/v1/chat/message/list-by-cid',
        method: 'get',
        params: param
    })
}

// 发送 Stream 消息
// 为什么不用 axios 呢？因为它不支持 SSE 调用
export async  function  sendChatStream(
    conversationId,
    userId,
    message,
    useContext,
    ctrl,
    onMessage,
    onError,
    onClose
) {
    return await fetchEventSource(`http://127.0.0.1:9101/web-api/v1/chat/stream`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'X-Content-Lang': 'zh-CN'
        },
        openWhenHidden: true,
        body: JSON.stringify({
            conversationId,
            userId,
            message,
            useContext: useContext
        }),
        onmessage: onMessage,
        onerror: onError,
        onclose: onClose,
        signal: ctrl.signal
    })
}
