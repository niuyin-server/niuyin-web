<script setup>
import {onMounted, onUnmounted, ref, nextTick} from 'vue'
import {imageGenerate, imageList} from "@/api/ai/image/message";

const inputMessage = ref('')
const isLoading = ref(false)

import img11 from '@/Layout/ai/image/assets/image-size-1-1.svg'
import img34 from '@/Layout/ai/image/assets/image-size-3-4.svg'
import img43 from '@/Layout/ai/image/assets/image-size-4-3.svg'
import img169 from '@/Layout/ai/image/assets/image-size-16-9.svg'
import img916 from '@/Layout/ai/image/assets/image-size-9-16.svg'
import {parseTime, smartDateFormat} from "@/utils/roydon";

// 图片生成比例
const genRadio = ref('0')
const genRatioOptions = [
  {label: '1:1', value: '0', image: img11},
  {label: '3:4', value: '1', image: img34},
  {label: '4:3', value: '2', image: img43},
  {label: '16:9', value: '3', image: img169},
  {label: '9:16', value: '4', image: img916},
]
const handleClickGenRadio = (item) => {
  genRadio.value = item.value
}

const messageReq = ref({
  message: inputMessage.value.trim(),
  radio: genRadio.value
})
const scrollbarRef = ref()
const sendMessage = () => {

  if (!inputMessage.value.trim() || isLoading.value) return
  isLoading.value = true
  messageReq.value.message = inputMessage.value.trim()
  messageReq.value.radio = genRadio.value
  inputMessage.value = ''
  const newImageData = {
    prompt: messageReq.value.message,
    picUrl: null,
    status: '0', // 0: 进行中，1：成功，2：失败
    createTime: parseTime(new Date()), // 0: 进行中，1：成功，2：失败
  }
  imageListData.value.unshift(newImageData)
  imageGenerate(messageReq.value).then((res) => {
    if (res?.code === 200) {
      console.log(res)
      scrollbarRef.value.setScrollTop(0)
      // 替换第一个数据
      imageListData.value[0] = res.data
    } else {

    }
    isLoading.value = false
  })
}

// 不能用分页，要用游标
const imageListPageDTO = ref({
  pageNum: 1,
  pageSize: 10,
})
const imageListData = ref([])
const imageListTotal = ref(0)
const imageListLoading = ref(true)
const imageListEmpty = ref(false)
const imageListNotMore = ref(true)

const initImageList = () => {
  imageList(imageListPageDTO.value).then((res) => {
    if (res?.code === 200) {
      imageListData.value = [...imageListData.value, ...res.rows]
      imageListTotal.value = res.total
      imageListLoading.value = false
      imageListNotMore.value = false
      if (imageListTotal.value === imageListData.value.length) {
        imageListNotMore.value = true
      }
    } else {

    }
  })
}

const handleLoadMore = () => {
  imageListPageDTO.value.pageNum++
  initImageList()
}

const imageRouter = ref([
  {
    name: '历史记录',
    value: '0',
    fas: 'fa-history'
  },
  {
    name: '图片广场',
    value: '1',
    fas: 'fa-images'
  }
])
const imageRouterActive = ref('0')

const handleClickImageRouter = (router) => {
  imageRouterActive.value = router.value
}

onMounted(() => {
  initImageList()

})

onUnmounted(() => {

})
</script>

<template>
  <div class="flex flex-1 w100" style="flex-direction: row">
    <!-- 左侧图片瀑布流 -->
    <div class="w-3/4 relative h100 flex flex-column">
      <!-- 顶部切换【历史记录/图片广场】-->
      <div class="flex space-x-4 justify-center items-center absolute left-1/2 -translate-x-1/2 top-2 z-10">
        <button
            v-for="item in imageRouter"
            :class="[item.value===imageRouterActive?'bg-blue-400':'']"
            class="px-4 py-2 bg-blue-100 hover:bg-blue-400 transition-all text-blue-600 border border-gray-200 rounded-full text-sm flex items-center"
            @click="handleClickImageRouter(item)"
        >
          <i class="fas mr-2" :class="item.fas"></i>{{ item.name }}
        </button>
      </div>
      <div class="text-l font-semibold text-gray-800 flex items-center mt-4 mb-2">
        <i class="fas fa-image mr-2 text-blue-500"></i> 图片生成记录/图片广场
      </div>
      <el-scrollbar v-if="imageRouterActive===imageRouter[0].value" class="overflow-y-auto flex-1" ref="scrollbarRef">
        <div class="waterfall-grid p-4">
          <!-- 生成的图片卡片 -->
          <el-skeleton class="w100" :loading="imageListLoading" animated>
            <template #template>
              <div class="loading-container" v-for="i in 2">
                <div class="loading-item" v-for="i in 5">
                  <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
                  <div class="p1rem">
                    <el-skeleton-item variant="h1" style="width: 80%"/>
                    <div>
                      <el-skeleton-item variant="text"/>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #default>
              <div v-for="item in imageListData"
                   class="waterfall-item relative hover:bg-gray-300 card-hover bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100 image-card cp">
                <img
                    v-if="item.status==='1'"
                    :src="item.picUrl"
                    :alt="item.prompt"
                    style="min-height: 120px"
                    class="w-full h-auto">
                <img v-else-if="item.status==='2'" src="./assets/image-preview-error.svg"/>
                <div v-else class="flex items-center justify-center p-8">
                  <i class="fas fa-spinner animate-spin text-yellow-500 text-7xl"/>
                </div>
                <span class="absolute top-0 text-gray-500 text-xs p-2"
                      v-if="item.status==='2'">{{ item.errorMessage }}</span>
                <div class="p-3">
                  <p class="text-sm text-gray-600  ">{{ item.prompt }}</p>
                  <div v-if="item.status === '0'" class="mt-1  ">
                    <i class="fas fa-spinner animate-spin text-yellow-500"/>
                    <span class="text-xs text-yellow-500 mt-1 ml-2">进行中</span>
                  </div>
                  <div class="flex justify-between items-center mt-1">
                    <span class="text-xs text-gray-500">{{ smartDateFormat(item.createTime) }}</span>
                    <button class="text-blue-500 hover:text-blue-700">
                      <i class="fas fa-share-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
          <!-- 更多图片卡片... -->
        </div>
        <div class="mb-4 flex items-center justify-center">
          <!--          加载更多按钮-->
          <el-button v-if="!imageListNotMore" class=" " @click="handleLoadMore">加载更多</el-button>
        </div>
      </el-scrollbar>
      <el-scrollbar v-else-if="imageRouterActive===imageRouter[1].value" class="overflow-y-auto flex-1"
                    ref="scrollbarRef">
        <div class="waterfall-grid p-4">
          <!-- 生成的图片卡片 -->
          <el-skeleton class="w100" :loading="imageListLoading" animated>
            <template #template>
              <div class="loading-container" v-for="i in 2">
                <div class="loading-item" v-for="i in 5">
                  <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
                  <div class="p1rem">
                    <el-skeleton-item variant="h1" style="width: 80%"/>
                    <div>
                      <el-skeleton-item variant="text"/>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #default>
              <div>
                图片广场
              </div>
            </template>
          </el-skeleton>
          <!-- 更多图片卡片... -->
        </div>
        <div class="mb-4 flex items-center justify-center">
          <!--          加载更多按钮-->
          <el-button class=" ">加载更多</el-button>
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧生成区域 -->
    <div class="w-1/4 flex flex-col p-4">
      <div class="flex-1 mb-4 bg-white rounded-xl shadow-sm p-4 overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <i class="fas fa-magic mr-2 text-blue-500"></i> 文字生成图片
          </h2>
        </div>

        <!-- 生成设置 -->
        <div class="mb-4 space-y-4">
          <!--          生成尺寸-->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">画幅比例</label>
            <div class="flex flex-row flex-between  overflow-hidden  border rounded-2xl">
              <div v-for="item in genRatioOptions"
                   class="flex content-center items-center hover:bg-blue-300 flex-col cp p-4 w-1/5 transition-all"
                   :class="[item.value === genRadio ? 'bg-blue-400' : 'bg-gray-100']"
                   @click="handleClickGenRadio(item)">
                <img :src="item.image" :alt="item.label" class="   " width="32" height="32">
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
          <!--          生成风格-->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">风格</label>
            <select class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option>写实风格</option>
              <option>卡通风格</option>
              <option>赛博朋克</option>
              <option>极简主义</option>
              <option>油画风格</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">生成质量</label>
            <select class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option>标准</option>
              <option selected>高性能</option>
              <option>高质量</option>
            </select>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="mb-4">
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
                  placeholder="请输入您想要生成的图片描述，例如：'一只坐在太空中的猫，戴着宇航员头盔，背景是星云和行星'"
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
.waterfall-grid {
  column-count: 5;
  column-gap: 1rem;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.image-card {
  transition: all 0.3s ease;
}

.image-card:hover {
  transform: scale(1.02);
}
</style>
