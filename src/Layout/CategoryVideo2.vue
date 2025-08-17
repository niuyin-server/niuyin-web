<template>
  <div class="w-full h-full">
    <!-- 分类子分类 -->
    <div v-if="videoCategoryChildrenList" class="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap sticky top-0 z-10 py-2">
      <span 
        v-for="item in videoCategoryChildrenList"
        :key="item.id"
        :class="[
          childrenCategoryId === item.id 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white',
          'inline-block px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200'
        ]"
        @click="handlePullCategoryVideo(item.id)"
      >
        {{ item.name }}
      </span>
    </div>

    <div class="w-full h-full">
      <el-scrollbar>
        <el-empty v-show="videoTotal === 0" description="暂无数据" />
        
        <el-skeleton class="w-full" :loading="loading" animated>
          <template #template>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
              <div v-for="i in 10" :key="i" class="space-y-3">
                <el-skeleton-item variant="image" class="w-full h-48 rounded-lg" />
                <div class="space-y-2">
                  <el-skeleton-item variant="h1" class="w-4/5" />
                  <el-skeleton-item variant="text" class="w-full" />
                </div>
              </div>
            </div>
          </template>
          
          <template #default>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
              <!-- 分类视频卡片 -->
              <div 
                v-for="(item, index) in videoList"
                :key="item.videoId"
                class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                :class="{ 'is-playing': playingItems[item.videoId] }"
              >
                <!-- 视频封面区域 -->
                <div 
                  class="relative w-full overflow-hidden rounded-t-xl"
                  :style="{ minHeight: '200px', maxHeight: '300px' }"
                  :ref="el => setCoverRef(item.videoId, el)"
                  @mouseenter="handleMouseEnter(item)"
                  @mouseleave="handleMouseLeave(item)"
                >
                  <!-- 封面图片 -->
                  <div v-if="!playingItems[item.videoId]" class="relative w-full h-full">
                    <el-image 
                      :src="item.coverImage" 
                      :alt="item.videoTitle"
                      class="w-full h-full transition-transform duration-300"
                      fit="cover"
                      loading="lazy"
                      @error="handleImageError(item)"
                    >
                      <template #error>
                        <div class="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-100 dark:bg-gray-700">
                          <el-icon class="text-4xl mb-2"><Picture /></el-icon>
                          <span class="text-xs">图片加载失败</span>
                        </div>
                      </template>
                    </el-image>
                    
                    <!-- 视频时长 -->
                    <div v-if="item.publishType === '0' && formatDuration(item.videoInfo)" 
                         class="absolute bottom-2 right-2 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs font-medium backdrop-blur-sm">
                      {{ formatDuration(item.videoInfo) }}
                    </div>
                    
                    <!-- 内容类型标签 -->
                    <div v-if="item.publishType === '1'" 
                         class="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-xl text-xs font-medium backdrop-blur-sm">
                      <el-icon class="text-xs"><Picture /></el-icon>
                      <span>图文</span>
                    </div>
                  </div>
                  
                  <!-- hover时的立即播放区域 -->
                  <div v-if="playingItems[item.videoId]" class="relative w-full h-full overflow-hidden rounded-t-xl">
                    <!-- 图文轮播 -->
                    <ImagePlayer 
                      v-if="item.publishType === '1'" 
                      :image-list="item.imageList"
                      :height="playerHeights[item.videoId]"
                      class="w-full h-full object-cover rounded-t-xl"
                    />
                    <!-- 视频播放 -->
                    <VideoPlayer 
                      v-else
                      :video="item"
                      class="w-full h-full object-cover rounded-t-xl"
                    />
                  </div>
                </div>
                
                <!-- 视频信息区域 -->
                <div class="p-4 flex-1 flex flex-col gap-3">
                  <h3 class="text-sm font-semibold leading-5 text-gray-900 dark:text-white line-clamp-2" 
                      :title="item.videoTitle">
                    {{ item.videoTitle }}
                  </h3>
                  
                  <p v-if="item.videoDesc" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {{ item.videoDesc }}
                  </p>
                  
                  <div class="flex items-center justify-between gap-2 mt-auto">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <el-avatar 
                        :src="item.author?.avatar" 
                        :size="24"
                        class="flex-shrink-0 cursor-pointer"
                        @click.stop="handlePersonInfo(item.userId)"
                      >
                        <el-icon><User /></el-icon>
                      </el-avatar>
                      <span class="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                        {{ item.author?.nickname || item.userNickName }}
                      </span>
                    </div>
                    
                    <div class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {{ smartDateFormat(item.createTime) }}
                    </div>
                  </div>
                  
                  <!-- 互动数据 -->
                  <div class="flex gap-4">
                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                      <el-icon class="text-sm"><View /></el-icon>
                      <span>{{ formatNumber(item.viewNum) }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                      <el-icon class="text-sm"><Star /></el-icon>
                      <span>{{ formatNumber(item.likeNum) }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                      <el-icon class="text-sm"><ChatDotRound /></el-icon>
                      <span>{{ formatNumber(item.commentNum || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Loading v-if="loadingIcon" :is-full-screen="false" />
          </template>
        </el-skeleton>
        
        <!-- 加载更多触发器 -->
        <div ref="loadMoreTrigger" class="h-4"></div>
        
        <div v-if="dataNotMore" class="text-center py-8">
          <el-divider>暂无更多数据</el-divider>
        </div>
      </el-scrollbar>
      
      <!-- 全屏播放对话框 -->
      <el-dialog 
        v-model="videoPlayDialogVisible"
        @close="dialogDestroy"
        width="80%"
        :destroy-on-close="true"
        :show-close="false"
      >
        <template #header="{ close, titleId, titleClass }">
          <h3 class="truncate" :id="titleId" :class="titleClass">
            {{ playingVideo?.videoTitle }}
          </h3>
          <el-button circle :icon="Close" type="info" @click="close" />
        </template>
        <video 
          class="w-full rounded-lg"
          style="max-height: 100vh; height: 60vh;"
          autoplay
          :src="playingVideo?.videoUrl"
          controls
        />
      </el-dialog>
    </div>
  </div>
</template>

<!--
*@author roydon
*@date 2023/12/20 20:08
-->
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Close, 
  UserFilled, 
  Picture, 
  View, 
  Star, 
  User, 
  ChatDotRound,
  FullScreen
} from '@element-plus/icons-vue'
import { userInfoX } from '@/store/userInfoX'
import { encodeData } from '@/utils/roydon.js'
import { pushVideoByCategory, videoCategoryChildrenList as getVideoCategoryChildrenList } from '@/api/video'
import Loading from '@/components/Loading.vue'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import ImagePlayer from '@/components/video/ImagePlayer.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const categoryId = ref(route.params.categoryId)
const loading = ref(true)
const loadingIcon = ref(false)
const loadingData = ref(true)
const dataNotMore = ref(false)
const videoList = ref([])
const videoTotal = ref(null)
const videoCategoryChildrenList = ref(null)
const childrenCategoryId = ref(null)
const videoPlayDialogVisible = ref(false)
const playingVideo = ref(null)

// hover播放相关状态
const playingItems = reactive({}) // 记录每个视频的播放状态
const playerHeights = reactive({}) // 记录每个播放器的高度
const coverRefs = reactive({}) // 记录封面元素引用

// IntersectionObserver相关
const loadMoreTrigger = ref(null)
let intersectionObserver = null

// 设置封面引用
const setCoverRef = (videoId, el) => {
  if (el) {
    coverRefs[videoId] = el
  }
}

// hover事件处理
const handleMouseEnter = async (item) => {
  playingItems[item.videoId] = true
  
  if (item.publishType === '1' && coverRefs[item.videoId]) {
    await nextTick()
    playerHeights[item.videoId] = coverRefs[item.videoId].clientHeight
  }
}

const handleMouseLeave = (item) => {
  playingItems[item.videoId] = false
}

// 图片加载错误处理
const handleImageError = (item) => {
  console.warn('封面图片加载失败:', item.coverImage)
}

// 数据加载
const pushCategoryVideo = async (categoryId) => {
  try {
    loading.value = true
    videoTotal.value = null
    const res = await pushVideoByCategory(categoryId)
    if (res.code === 200) {
      videoList.value = videoList.value.concat(res.data)
      videoTotal.value = videoList.value.length
      loading.value = false
    }
  } catch (error) {
    console.error('加载分类视频失败:', error)
    loading.value = false
  }
}

// 加载更多数据
const loadMoreData = async () => {
  if (!loadingData.value || dataNotMore.value) return
  
  loadingData.value = false
  loadingIcon.value = true
  
  try {
    const res = await pushVideoByCategory(childrenCategoryId.value)
    if (res.code === 200) {
      if (res.data.length === 0) {
        dataNotMore.value = true
        loadingIcon.value = false
        loadingData.value = false
        return
      }
      videoList.value = videoList.value.concat(res.data)
      loadingIcon.value = false
      setTimeout(() => {
        loadingData.value = true
      }, 1000)
    } else {
      loadingIcon.value = false
      loadingData.value = true
    }
  } catch (error) {
    console.error('加载更多视频失败:', error)
    loadingIcon.value = false
    loadingData.value = true
  }
}

// 初始化IntersectionObserver
const initIntersectionObserver = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
  
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreData()
        }
      })
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
  )
  
  if (loadMoreTrigger.value) {
    intersectionObserver.observe(loadMoreTrigger.value)
  }
}

// 清理IntersectionObserver
const cleanupIntersectionObserver = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
}

// 跳转到用户详情页面
const handlePersonInfo = (userId) => {
  const loginUser = userInfoX().userInfo
  if (userId === loginUser.userId) {
    router.push({ path: '/user' })
  } else {
    router.push({ path: '/person/' + encodeData(userId) })
  }
}

// 初始化分类子列表
const initParentCategoryChildrenList = async () => {
  try {
    const res = await getVideoCategoryChildrenList(categoryId.value)
    if (res.code === 200) {
      videoCategoryChildrenList.value = res.data
      videoCategoryChildrenList.value.unshift({
        id: categoryId.value,
        name: "全部",
        categoryImage: null
      })
      childrenCategoryId.value = categoryId.value
    }
  } catch (error) {
    console.error('加载分类子列表失败:', error)
  }
}

// 点击指定子分类的视频
const handlePullCategoryVideo = async (id) => {
  // 清理旧的observer
  cleanupIntersectionObserver()
  
  // 重置状态
  childrenCategoryId.value = id
  videoList.value = []
  dataNotMore.value = false
  loadingData.value = true
  
  // 加载新数据
  await pushCategoryVideo(childrenCategoryId.value)
  
  // 重新初始化observer
  await nextTick()
  initIntersectionObserver()
}

// 打开视频播放对话框
const handleVideoDialog = (item) => {
  playingVideo.value = item
  videoPlayDialogVisible.value = true
}

// 关闭对话框
const dialogDestroy = () => {
  videoPlayDialogVisible.value = false
}

// 工具函数
const formatDuration = (videoInfo) => {
  if (!videoInfo) return ''
  
  try {
    const info = JSON.parse(videoInfo)
    const duration = info.duration
    
    if (!duration) return ''
    
    const hours = Math.floor(duration / 3600000)
    const minutes = Math.floor((duration % 3600000) / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  } catch (error) {
    console.warn('解析视频时长失败:', error)
    return ''
  }
}

const formatNumber = (num) => {
  if (!num || num === 0) return '0'
  
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace('.0', '') + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'k'
  }
  return num.toString()
}

const smartDateFormat = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// 生命周期
onMounted(async () => {
  await initParentCategoryChildrenList()
  await pushCategoryVideo(categoryId.value)
  
  // 等待DOM更新后初始化IntersectionObserver
  await nextTick()
  initIntersectionObserver()
})

onUnmounted(() => {
  cleanupIntersectionObserver()
})

// 路由监听
watch(() => route.params.categoryId, async (newCategoryId) => {
  if (newCategoryId !== undefined) {
    // 清理旧的observer
    cleanupIntersectionObserver()
    
    // 重置状态
    categoryId.value = newCategoryId
    videoList.value = []
    videoTotal.value = null
    loading.value = true
    loadingIcon.value = false
    loadingData.value = true
    dataNotMore.value = false
    
    // 加载新数据
    await initParentCategoryChildrenList()
    await pushCategoryVideo(categoryId.value)
    
    // 重新初始化observer
    await nextTick()
    initIntersectionObserver()
  }
})
</script>

<style scoped>
/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 播放时提示动画 */
.is-playing .absolute.top-3.right-3 {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* 播放器样式覆盖 */
:deep(.d-player-wrap .d-player-control) {
  height: 10px !important;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  display: none !important;
}

/* 滚动条样式 */
:deep(.el-scrollbar__bar) {
  opacity: 0.3;
}

:deep(.el-scrollbar__bar:hover) {
  opacity: 0.8;
}
</style>
