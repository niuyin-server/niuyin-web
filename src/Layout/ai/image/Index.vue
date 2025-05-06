<script setup lang="ts">
import {ref} from 'vue'

const inputMessage = ref('')
const isLoading = ref(false)

const sendMessage = async () => {

  if (!inputMessage.value.trim() || isLoading.value) return
  isLoading.value = true
  const userContent = inputMessage.value.trim()
  inputMessage.value = ''

}
</script>

<template>
  <div class="flex flex-1 w100 space-x-2 p-4" style="flex-direction: row">
    <!-- 左侧图片瀑布流 -->
    <div class="w-2/3 relative h100 flex flex-column">
      <!-- 顶部切换【历史记录/图片广场】-->
      <div class="flex space-x-2 justify-center items-center absolute left-1/2 -translate-x-1/2 bottom-0 z-10">
        <button
            class="px-4 py-2 bg-blue-100 hover:bg-blue-300 transition-all text-blue-600 border border-gray-200 rounded-full text-sm flex items-center">
          <i class="fas fa-history mr-1"></i> 历史记录
        </button>
        <button
            class="px-4 py-2 bg-blue-100 hover:bg-blue-300 transition-all text-blue-600 border border-gray-200 rounded-full text-sm flex items-center">
          <i class="fas fa-images mr-1"></i> 图片广场
        </button>
      </div>
      <div class="text-l font-semibold text-gray-800 flex items-center mb-4">
        <i class="fas fa-image mr-2 text-blue-500"></i> 图片生成记录/图片广场
      </div>
      <el-scrollbar class="overflow-y-auto flex-1 pr-3">
        <div class="grid grid-cols-3 gap-4">
          <!-- 生成的图片卡片 -->
          <div class="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <img
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="AI生成图片"
                class="w-full h-40 object-cover">
            <div class="p-3">
              <p class="text-sm text-gray-600 truncate">星空下的城市夜景，赛博朋克风格</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-500">刚刚</span>
                <button class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-for="i in 10" class="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="AI生成图片"
                class="w-full h-40 object-cover">
            <div class="p-3">
              <p class="text-sm text-gray-600 truncate">未来主义建筑，极简设计</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-500">2分钟前</span>
                <button class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <img
                src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="AI生成图片"
                class="w-full h-40 object-cover">
            <div class="p-3">
              <p class="text-sm text-gray-600 truncate">未来主义建筑，极简设计</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-gray-500">20分钟前</span>
                <button class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 更多图片卡片... -->
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧生成区域 -->
    <div class="w-1/3 flex flex-col">
      <div class="flex-1 mb-4 bg-white rounded-xl shadow-sm p-4 overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <i class="fas fa-magic mr-2 text-blue-500"></i> 文字生成图片
          </h2>
        </div>

        <!-- 生成设置 -->
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">风格</label>
            <select class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option>写实风格</option>
              <option>卡通风格</option>
              <option>赛博朋克</option>
              <option>极简主义</option>
              <option>油画风格</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">画幅比例</label>
            <select class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
              <option>4:3</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">生成质量</label>
            <select class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option>标准</option>
              <option selected>高性能</option>
              <option>高质量</option>
            </select>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2 cursor-pointer">
            <h3 class="text-sm font-medium text-gray-700 flex items-center">
              <i class="fas fa-cog mr-2 text-blue-500"></i> 高级设置
            </h3>
            <i class="fas fa-chevron-down text-gray-500"></i>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">参考图片</label>
                <div class="flex items-center">
                  <button class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm flex items-center">
                    <i class="fas fa-upload mr-2"></i> 上传
                  </button>
                  <span class="ml-2 text-xs text-gray-500">可选</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">尾帧图</label>
                <div class="flex items-center">
                  <input type="checkbox" class="rounded text-blue-500 mr-2">
                  <span class="text-xs text-gray-500">需上传参考图片</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成区域 -->
        <div class="mb-6">
          <div class="flex items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 mr-2">描述词</label>
            <button class="text-xs text-blue-500 flex items-center">
              <i class="fas fa-lightbulb mr-1"></i> 提示词建议
            </button>
          </div>
          <div class="relative">
              <textarea
                  class="w-full input-field px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50"
                  rows="3"
                  placeholder="请输入您想要生成的图片描述，例如：'一只坐在太空中的猫，戴着宇航员头盔，背景是星云和行星，超现实主义风格'"
                  @keyup.enter="sendMessage"
                  ref="inputRef"
                  style="min-height: 104px"
                  v-model="inputMessage"
                  :disabled="isLoading"></textarea>
            <div class="absolute right-3 bottom-3 flex gap-2">
              <button
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                <i class="fas fa-image"></i>
              </button>
              <button
                  class="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
                  :class="{ 'bg-red-500 hover:bg-red-600': isLoading }"
                  @click="sendMessage">
                <i v-if="isLoading" class="fas fa-spinner animate-spin"/>
                <i v-else class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部说明 -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <i class="fas fa-info-circle mr-2 text-blue-500"></i> 使用说明
        </h4>
        <ul class="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>尾帧图需额外支付3积分</li>
          <li>10秒视频生成需支付对应积分</li>
          <li>尾帧功能必须上传参考图片才生效</li>
          <li>生成的图片默认仅自己可见，可分享到图片广场</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
