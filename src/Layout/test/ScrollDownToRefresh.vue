<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {LoadingOne} from '@icon-park/vue-next'
import {pushVideo} from '@/api/video'

const props = defineProps({
  columnCount: {
    type: Number,
    default: 5
  }
})

const items = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const observerRef = ref(null)
const loadingRef = ref(null)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3

// 每个视频的高度根据屏幕宽度和列数动态计算 比例16：9
const height = ref(window.innerWidth * 9 / 16 / props.columnCount)

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  console.log('Loading more items...')
  loading.value = true
  try {
    // 调用真实的pushVideo接口
    const response = await pushVideo()
    console.log('API Response:', response)

    // 检查响应格式并提取数据
    const newItems = response.data?.data || response.data || []
    console.log('New items:', newItems)

    if (newItems.length === 0) {
      hasMore.value = false
    } else {
      // 成功获取数据时重置错误状态
      error.value = null
      retryCount.value = 0

      items.value = [...items.value, ...newItems]
      page.value += 1
      // 重新计算页面高度
      nextTick(() => {
        if (loadingRef.value) {
          observerRef.value.unobserve(loadingRef.value)
          observerRef.value.observe(loadingRef.value)
        }
      })
    }
  } catch (err) {
    console.error('Error fetching items:', err)
    error.value = err.message || '获取视频数据失败，请稍后重试'

    // 自动重试机制
    if (retryCount.value < maxRetries) {
      retryCount.value++
      console.log(`自动重试第 ${retryCount.value} 次...`)
      setTimeout(() => {
        error.value = null
        loadMore()
      }, 2000)
    }
  } finally {
    loading.value = false
  }
}

// 手动重试方法
const retryLoad = () => {
  error.value = null
  retryCount.value = 0
  loadMore()
}

// 清除错误状态
const clearError = () => {
  error.value = null
  retryCount.value = 0
}

// 防抖的loadMore函数（在loadMore定义之后）
const debouncedLoadMore = debounce(loadMore, 300)

const observeIntersection = (entries) => {
  if (entries[0].isIntersecting && !loading.value && !error.value) {
    debouncedLoadMore()
  }
}

// 响应式窗口大小调整
const updateHeight = () => {
  height.value = window.innerWidth * 9 / 16 / props.columnCount
}

// 创建防抖的resize处理函数
const debouncedUpdateHeight = debounce(updateHeight, 100)

onMounted(async () => {
  // 初始化高度计算
  updateHeight()

  // 监听窗口大小变化
  window.addEventListener('resize', debouncedUpdateHeight)

  // 初始化IntersectionObserver
  observerRef.value = new IntersectionObserver(observeIntersection, {
    threshold: 0.1,
    rootMargin: '50px' // 提前50px开始加载
  })

  if (loadingRef.value) {
    observerRef.value.observe(loadingRef.value)
  }

  // 自动加载第一页数据
  await loadMore()
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', debouncedUpdateHeight)

  // 断开IntersectionObserver
  if (observerRef.value) {
    observerRef.value.disconnect()
  }
})

watch(() => props.columnCount, (newColumnCount) => {
  // 当列数变化时重新计算高度
  updateHeight()
})

const playVideo = (item) => {
  console.log("hover")
  item.showVideo = true

  if (item.publishType === '0') {
    // 视频类型
    const videoElement = document.querySelector(`video[src="${item.videoUrl}"]`)
    if (videoElement && !videoElement.paused) {
      // 视频已经在播放中
      console.log('Video is already playing');
    } else if (videoElement) {
      // 开始播放视频
      videoElement.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  } else if (item.publishType === '1') {
    // 图文类型，启动轮播
    startCarousel(item)
  }
}

const pauseVideo = (item) => {
  item.showVideo = false
  const videoElement = document.querySelector(`video[src="${item.videoUrl}"]`)
  if (videoElement) {
    videoElement.pause()
    videoElement.currentTime = 0
  }

  // 停止图文轮播
  if (item.carouselTimer) {
    clearInterval(item.carouselTimer)
    item.carouselTimer = null
  }
}

// 图文轮播控制函数
const nextImage = (item) => {
  if (!item.imageList || item.imageList.length <= 1) return
  item.currentImageIndex = ((item.currentImageIndex || 0) + 1) % item.imageList.length
}

const prevImage = (item) => {
  if (!item.imageList || item.imageList.length <= 1) return
  item.currentImageIndex = ((item.currentImageIndex || 0) - 1 + item.imageList.length) % item.imageList.length
}

// 启动自动轮播
const startCarousel = (item) => {
  if (!item.imageList || item.imageList.length <= 1) return

  // 初始化当前图片索引
  if (item.currentImageIndex === undefined) {
    item.currentImageIndex = 0
  }

  // 清除已存在的定时器
  if (item.carouselTimer) {
    clearInterval(item.carouselTimer)
  }

  // 启动自动轮播，每3秒切换一张图片
  item.carouselTimer = setInterval(() => {
    nextImage(item)
  }, 3000)
}
</script>

<template>
  <div class="p-4">
    <div class="grid gap-4"
         :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }">
      <!-- foreach items video card-->
      <div
          v-for="item in items"
          :key="item.videoId"
          class="flex flex-col break-inside-avoid shadow-md hover:shadow-lg transition ease-in-out duration-300 rounded-lg"
      >
        <!-- 封面区域 -->
        <div class="w-full h-auto relative"
             :style="{ height: `${height}px` }"
             @mouseover="playVideo(item)"
             @mouseout="pauseVideo(item)">
          <img
              :src="item.coverImage"
              :alt="item.videoTitle"
              class="w-full h-full rounded-t-lg absolute top-0 left-0"
              :style="{ height: `${height}px`, objectFit: 'cover' }"
              v-if="!item.showVideo"
          />
          <!-- 发布类型：publishType：0视频1图文 -->
          <div class="w-full h-full rounded-t-lg absolute top-0 left-0"
               :style="{ height: `${height}px` }"
               v-if="item.publishType==='0' && item.showVideo">
            <!-- 背景图片 -->
            <div class="absolute inset-0 bg-cover bg-center rounded-t-lg"
                 :style="{ backgroundImage: `url(${item.coverImage})` }">
              <!-- backdrop滤镜 -->
              <div class="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-t-lg"></div>
            </div>
            <!-- 视频播放器 -->
            <video
                :src="item.videoUrl"
                class="w-full h-full rounded-t-lg relative z-10"
                :style="{ height: `${height}px`, objectFit: 'contain' }"
                controls
                preload="auto"
            ></video>
          </div>
          <!-- 图文轮播组件 -->
          <div class="w-full h-full rounded-t-lg absolute top-0 left-0 overflow-hidden"
               :style="{ height: `${height}px` }"
               v-else-if="item.publishType==='1' && item.showVideo">
            <!-- 背景图片 -->
            <div class="absolute inset-0 bg-cover bg-center rounded-t-lg"
                 :style="{ backgroundImage: `url(${item.coverImage})` }">
              <!-- backdrop滤镜 -->
              <div class="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-t-lg"></div>
            </div>
            <div class="relative w-full h-full z-10">
              <!-- 轮播图片 -->
              <div class="w-full h-full transition-transform duration-500 ease-in-out"
                   :style="{ transform: `translateX(-${(item.currentImageIndex || 0) * 100}%)`, display: 'flex' }">
                <img v-for="(image, index) in item.imageList"
                     :key="index"
                     :src="image"
                     :alt="`${item.videoTitle} - 图片${index + 1}`"
                     class="w-full h-full object-contain flex-shrink-0"
                     :style="{ minWidth: '100%' }" />
              </div>

              <!-- 轮播指示器 -->
              <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1"
                   v-if="item.imageList && item.imageList.length > 1">
                <div v-for="(image, index) in item.imageList"
                     :key="index"
                     class="w-2 h-2 rounded-full transition-colors duration-300"
                     :class="(item.currentImageIndex || 0) === index ? 'bg-white' : 'bg-white/50'">
                </div>
              </div>

              <!-- 左右切换按钮 -->
              <div class="absolute inset-y-0 left-0 flex items-center"
                   v-if="item.imageList && item.imageList.length > 1">
                <button @click="prevImage(item)"
                        class="ml-2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
                  ‹
                </button>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center"
                   v-if="item.imageList && item.imageList.length > 1">
                <button @click="nextImage(item)"
                        class="mr-2 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors">
                  ›
                </button>
              </div>
            </div>
          </div>
          <img v-else
               :src="item.coverImage"
               :alt="item.videoTitle"
               :style="{ height: `${height}px`, objectFit: 'cover' }"
               class="w-full h-full rounded-t-lg absolute top-0 left-0"/>
        </div>
        <!-- 标题区域 -->
        <div class="h-auto p-3 flex flex-col justify-between grow">
          <div class="text-base text-clamp-2 font-semibold text-left">{{ item.videoTitle }}</div>
          <div class="flex justify-start mt-1">
            <img :src="item.userAvatar" :alt="item.userNickName" class="shadow-md size-8 rounded-full"/>
            <span class="text-xs flex ml-2" style="align-items: center;">{{ item.userNickName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="loadingRef" class="flex justify-center items-center py-8">
      <LoadingOne v-if="loading" class="animate-spin"/>
      <div v-if="error" class="flex flex-col items-center space-y-2">
        <p class="text-red-500 text-center">{{ error }}</p>
        <button
          @click="retryLoad"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </div>
      <p v-if="!hasMore && !error" class="text-gray-500">没有更多内容了</p>
    </div>
  </div>
</template>

<style scoped>

</style>
