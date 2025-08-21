<script setup>
import {onMounted, onUnmounted, ref, nextTick, computed, watch} from 'vue'
import {imageGenerate, imageList} from "@/api/ai/image/message";
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useWaterfallLayout } from '@/composables/useWaterfallLayout'

const inputMessage = ref('')
const isLoading = ref(false)

import img11 from '@/Layout/ai/image/assets/image-size-1-1.svg'
import img12 from '@/Layout/ai/image/assets/image-size-1-2.svg'
import img21 from '@/Layout/ai/image/assets/image-size-2-1.svg'
import img34 from '@/Layout/ai/image/assets/image-size-3-4.svg'
import img43 from '@/Layout/ai/image/assets/image-size-4-3.svg'
import img169 from '@/Layout/ai/image/assets/image-size-16-9.svg'
import img916 from '@/Layout/ai/image/assets/image-size-9-16.svg'
import {parseTime, smartDateFormat} from "@/utils/roydon";

// 图片生成比例
const genRadio = ref('1:1')
const genRatioOptions = [
  {label: '1:1', value: '1:1', image: img11},
  {label: '1:2', value: '1:2', image: img12},
  // {label: '2:1', value: '2:1', image: img21},
  {label: '3:4', value: '3:4', image: img34},
  {label: '4:3', value: '4:3', image: img43},
  {label: '16:9', value: '16:9', image: img169},
  {label: '9:16', value: '9:16', image: img916},
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

// 瀑布流布局
const {
  containerRef,
  columns,
  itemPositions,
  calculateItemPosition,
  resetLayout,
  getContainerHeight
} = useWaterfallLayout({
  columnWidth: 280,
  gap: 16,
  minColumns: 1,
  maxColumns: 4
})

// 无限滚动
const loadMoreImages = async () => {
  if (imageListNotMore.value || imageListLoading.value) return

  imageListLoading.value = true
  imageListPageDTO.value.pageNum++

  try {
    const res = await imageList(imageListPageDTO.value)
    if (res?.code === 200) {
      imageListData.value = [...imageListData.value, ...res.rows]
      imageListTotal.value = res.total

      if (imageListTotal.value === imageListData.value.length) {
        imageListNotMore.value = true
      }
    }
  } catch (error) {
    console.error('加载图片失败:', error)
  } finally {
    imageListLoading.value = false
  }
}

const { targetRef: loadMoreRef, isLoading: infiniteLoading } = useInfiniteScroll(
  loadMoreImages,
  { threshold: 0.1, rootMargin: '100px' }
)

// 数据管理
const imageListPageDTO = ref({
  pageNum: 1,
  pageSize: 10,
})
const imageListData = ref([])
const imageListTotal = ref(0)
const imageListLoading = ref(true)
const imageListEmpty = ref(false)
const imageListNotMore = ref(false)

const initImageList = async () => {
  imageListLoading.value = true
  try {
    const res = await imageList(imageListPageDTO.value)
    if (res?.code === 200) {
      imageListData.value = res.rows
      imageListTotal.value = res.total
      imageListEmpty.value = res.rows.length === 0

      if (imageListTotal.value === imageListData.value.length) {
        imageListNotMore.value = true
      }
    }
  } catch (error) {
    console.error('初始化图片列表失败:', error)
  } finally {
    imageListLoading.value = false
  }
}

// 简化布局逻辑，使用CSS Grid代替复杂的绝对定位
const itemHeights = ref(new Map())

// 获取卡片样式 - 使用简单的相对定位
const getItemStyle = (item, index) => {
  return {
    width: '280px',
    opacity: 1,
    transform: 'translateY(0)'
  }
}

// 计算每个项目应该放在哪一列
const getColumnIndex = (index) => {
  return index % columns.value
}

// 监听数据变化，重新计算布局
watch(imageListData, () => {
  nextTick(() => {
    resetLayout()
  })
}, { deep: true })

// 监听列数变化，重新计算布局
watch(columns, () => {
  nextTick(() => {
    resetLayout()
  })
})

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
            :class="[item.value===imageRouterActive?'bg-[var(--niuyin-primary-color)]':'']"
            class="px-4 py-2 hover:bg-[var(--niuyin-primary-color-8)] transition-all text-[var(--niuyin-text-color)] border border-[var(--niuyin-border-color)] rounded-full text-sm flex items-center"
            @click="handleClickImageRouter(item)"
        >
          <i class="fas mr-2" :class="item.fas"></i>{{ item.name }}
        </button>
      </div>
      <div class="text-l font-semibold flex items-center mt-4 mb-2">
        <i class="fas fa-image mr-2 text-[var(--niuyin-primary-color)]"></i> 图片生成记录/图片广场
      </div>
      <el-scrollbar v-if="imageRouterActive===imageRouter[0].value" class="overflow-y-auto flex-1" ref="scrollbarRef">
        <!-- 瀑布流容器 -->
        <div class="waterfall-container p-4">
          <!-- 初始加载骨架屏 -->
          <div v-if="imageListLoading && imageListData.length === 0" class="waterfall-skeleton">
            <div v-for="i in 8" :key="i" class="skeleton-item">
              <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
              <div class="p-3">
                <el-skeleton-item variant="h1" style="width: 80%"/>
                <el-skeleton-item variant="text"/>
              </div>
            </div>
          </div>

          <!-- 瀑布流图片卡片 -->
          <div
            v-for="(item, index) in imageListData"
            :key="item.id || index"
            class="waterfall-item transition-all duration-300 ease-out waterfall-item-enter"
          >
            <div class="image-card relative hover:bg-[var(--bg-video-card-5)] card-hover bg-[var(--bg-video-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--niuyin-border-color)] cp">
              <img
                v-if="item.status==='1'"
                :src="item.picUrl"
                :alt="item.prompt"
                class="w-full h-auto"
                @load="onImageLoad(item, index)"
                @error="onImageError(item, index)"
              />
              <img v-else-if="item.status==='2'" src="./assets/image-preview-error.svg"/>
              <div v-else class="flex items-center justify-center p-8">
                <i class="fas fa-spinner animate-spin text-yellow-500 text-7xl"/>
              </div>
              <span class="absolute top-0 text-gray-500 text-xs p-2"
                    v-if="item.status==='2'">{{ item.errorMessage }}</span>
              <div class="p-3">
                <p class="text-sm">{{ item.prompt }}</p>
                <div v-if="item.status === '0'" class="mt-1">
                  <i class="fas fa-spinner animate-spin text-yellow-500"/>
                  <span class="text-xs text-yellow-500 mt-1 ml-2">进行中</span>
                </div>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-xs text-gray-500">{{ smartDateFormat(item.createTime) }}</span>
                  <button class="text-[var(--niuyin-primary-color)] hover:text-[var(--niuyin-primary-color-8)]">
                    <i class="fas fa-share-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无限滚动触发器 -->
        <div
          ref="loadMoreRef"
          class="load-more-trigger flex items-center justify-center py-8"
          v-if="!imageListNotMore"
        >
          <div v-if="infiniteLoading || imageListLoading" class="flex items-center space-x-2">
            <i class="fas fa-spinner animate-spin text-[var(--niuyin-primary-color)]"></i>
            <span class="text-sm text-gray-500">加载中...</span>
          </div>
        </div>

        <!-- 加载完成提示 -->
        <div v-if="imageListNotMore && imageListData.length > 0" class="text-center py-8">
          <span class="text-sm text-gray-500">已加载全部内容</span>
        </div>

        <!-- 空状态 -->
        <div v-if="imageListEmpty && !imageListLoading" class="text-center py-16">
          <i class="fas fa-image text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">暂无图片记录</p>
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
      <div class="flex-1 mb-4 bg-[var(--bg-video-card)] rounded-xl shadow-sm p-4 overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold flex items-center">
            <i class="fas fa-magic mr-2 text-[var(--niuyin-primary-color)]"></i> 文字生成图片
          </h2>
        </div>

        <!-- 生成设置 -->
        <div class="mb-4 space-y-4">
          <!--          生成尺寸-->
          <div>
            <label class="block text-sm font-medium mb-2">画幅比例</label>
            <div
                class="flex flex-row flex-between overflow-hidden border border-[var(--niuyin-border-color)] rounded-2xl">
              <div v-for="item in genRatioOptions"
                   class="flex content-center items-center hover:bg-[var(--niuyin-primary-color-8)] flex-col cp px-4 py-2 w-1/6 transition-all"
                   :class="[item.value === genRadio ? 'bg-[var(--niuyin-primary-color)]' : 'bg-[var(--niuyin-icon-bg)]']"
                   @click="handleClickGenRadio(item)">
                <img :src="item.image" :alt="item.label" width="32" height="32">
                <span class="text-sm">{{ item.label }}</span>
              </div>
            </div>
          </div>
          <!--          生成风格-->
          <div>
            <label class="block text-sm font-medium mb-2">风格</label>
            <select
                class="w-full border border-[var(--niuyin-border-color)] rounded-lg p-2 text-sm focus:ring-1 focus:ring-[var(--niuyin-primary-color)]">
              <option>写实风格</option>
              <option>卡通风格</option>
              <option>赛博朋克</option>
              <option>极简主义</option>
              <option>油画风格</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">生成质量</label>
            <select
                class="w-full border border-[var(--niuyin-border-color)] rounded-lg p-2 text-sm focus:ring-1 focus:ring-[var(--niuyin-primary-color)]">
              <option>标准</option>
              <option selected>高性能</option>
              <option>高质量</option>
            </select>
          </div>
        </div>

        <!-- 高级设置 -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2 cursor-pointer">
            <h3 class="text-sm font-medium flex items-center">
              <i class="fas fa-cog mr-2 text-[var(--niuyin-primary-color)]"></i> 高级设置
            </h3>
            <i class="fas fa-chevron-down text-gray-500"></i>
          </div>
          <div class="bg-[var(--niuyin-icon-bg)] p-4 rounded-xl">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">参考图片</label>
                <div class="flex items-center">
                  <button class="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm flex items-center">
                    <i class="fas fa-upload mr-2"></i> 上传
                  </button>
                  <span class="ml-2 text-xs text-gray-200">可选</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">尾帧图</label>
                <div class="flex items-center">
                  <input type="checkbox" class="rounded text-blue-500 mr-2">
                  <span class="text-xs text-gray-200">需上传参考图片</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成区域 -->
        <div class="mb-6">
          <div class="flex items-center mb-2">
            <label class="block text-sm font-medium mr-2">描述词</label>
            <button class="text-xs text-[var(--niuyin-primary-color)] flex items-center">
              <i class="fas fa-lightbulb mr-1"></i> 提示词建议
            </button>
          </div>
          <div class="relative">
              <textarea
                  class="w-full px-3 py-2 border border-[var(--niuyin-border-color)] rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--niuyin-primary-color)] focus:border-[var(--niuyin-primary-color)] disabled:opacity-50"
                  rows="3"
                  placeholder="请输入您想要生成的图片描述，例如：'一只坐在太空中的猫，戴着宇航员头盔，背景是星云和行星'"
                  @keyup.enter="sendMessage"
                  ref="inputRef"
                  style="min-height: 104px"
                  v-model="inputMessage"
                  :disabled="isLoading"></textarea>
            <div class="absolute right-3 bottom-3 flex gap-2">
              <button
                  class="w-8 h-8 rounded-full bg-[var(--niuyin-icon-bg)] hover:bg-[var(--niuyin-icon-bg-5)] flex items-center justify-center text-gray-500 transition-colors">
                <i class="fas fa-image"></i>
              </button>
              <button
                  class="w-8 h-8 rounded-full bg-[var(--niuyin-primary-color)] hover:bg-[var(--niuyin-primary-color-8)] flex items-center justify-center text-white transition-colors"
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
      <div class="bg-[var(--bg-video-card)] rounded-xl shadow-sm p-4">
        <h4 class="text-sm font-medium mb-2 flex items-center">
          <i class="fas fa-info-circle mr-2 text-[var(--niuyin-primary-color)]"></i> 使用说明
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
/* 瀑布流容器 - 使用CSS Grid */
.waterfall-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
}

/* 瀑布流项目 */
.waterfall-item {
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片进入动画 */
.waterfall-item-enter {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 图片卡片样式 */
.image-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.image-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 骨架屏布局 */
.waterfall-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.skeleton-item {
  background: var(--bg-video-card);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--niuyin-border-color);
}

/* 加载触发器 */
.load-more-trigger {
  min-height: 60px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .waterfall-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  .waterfall-skeleton {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .waterfall-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .waterfall-skeleton {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .waterfall-container {
    grid-template-columns: 1fr;
  }

  .waterfall-skeleton {
    grid-template-columns: 1fr;
  }
}

/* 加载状态动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
