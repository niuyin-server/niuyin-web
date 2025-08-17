<template>
  <div class="discover-container wh100">
    <el-scrollbar>
      <el-empty v-if="videoList.size === 0" description="暂无数据"/>
      <el-skeleton class="w100" :loading="loading" animated>
        <template #template>
          <div class="loading-container" v-for="i in 2">
            <div class="loading-item" v-for="i in 5">
              <el-skeleton-item variant="image" style="width: 100%; height: 300px"/>
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
          <div class="hotVideo-list w100" style="height: auto">
            <div class="hotVideos cp"
                 v-masonry
                 fit-width="true"
                 transition-duration="0.2s"
                 column-width=".discover-item"
                 item-selector=".discover-item">
              <div v-for='(item,index) in videoList'
                   :key="item.videoId"
                   v-masonry-tile
                   class="discover-item">
                <VideoDiscoverCard :video="item"/>
              </div>
            </div>
            <Loading v-if="loadingIcon" :is-full-screen="false"/>
          </div>
        </template>
      </el-skeleton>
      <!-- 错误处理UI -->
      <div v-if="error && videoList.length === 0" class="error-container">
        <el-empty description="加载失败">
          <template #image>
            <el-icon size="60" color="#909399">
              <Warning />
            </el-icon>
          </template>
          <template #description>
            <p class="error-message">{{ error }}</p>
            <el-button type="primary" @click="retryLoad">重试</el-button>
          </template>
        </el-empty>
      </div>
      
      <!-- 底部状态 -->
      <div v-if="!error">
        <div v-if="dataNotMore && videoList.length > 0">
          <el-divider>暂无更多数据</el-divider>
        </div>
        <div v-else-if="error && videoList.length > 0" class="load-more-error">
          <el-alert
            title="加载更多失败"
            :description="error"
            type="warning"
            show-icon
            :closable="false"
          >
            <template #default>
              <el-button size="small" type="primary" @click="loadVideoData(true)">重试</el-button>
            </template>
          </el-alert>
        </div>
      </div>
    </el-scrollbar>
    <el-backtop :right="16" :bottom="16" target=".main-container  .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<!--
*@author roydon
*@date 2023/12/7 11:13
-->
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { pushVideo } from "@/api/video.js"
import { UserFilled, Warning } from "@element-plus/icons-vue"
import VideoShowCard from "@/components/video/VideoShowCard.vue"
import Loading from "@/components/Loading.vue"
import VideoDiscoverCard from "@/components/video/card/VideoDiscoverCard.vue"

// 响应式数据
const loading = ref(true)
const loadingIcon = ref(false)
const dataNotMore = ref(false)
const loadingData = ref(true)
const videoList = ref([])
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3

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

// 加载视频数据
const loadVideoData = async (isLoadMore = false) => {
  try {
    if (!isLoadMore) {
      loading.value = true
    } else {
      loadingIcon.value = true
      loadingData.value = false
    }

    const response = await pushVideo()
    
    if (response.code === 200) {
      const newData = response.data || []
      
      if (newData.length === 0) {
        dataNotMore.value = true
        return
      }

      if (isLoadMore) {
        videoList.value = [...videoList.value, ...newData]
      } else {
        videoList.value = newData
      }

      // 成功后重置错误状态
      error.value = null
      retryCount.value = 0
      
    } else {
      throw new Error(response.msg || '获取数据失败')
    }
  } catch (err) {
    console.error('Error loading video data:', err)
    error.value = err.message || '获取视频数据失败'
    
    // 自动重试机制
    if (retryCount.value < maxRetries) {
      retryCount.value++
      console.log(`自动重试第 ${retryCount.value} 次...`)
      setTimeout(() => {
        loadVideoData(isLoadMore)
      }, 2000)
    } else {
      ElMessage.error(error.value)
    }
  } finally {
    loading.value = false
    loadingIcon.value = false
    
    if (isLoadMore) {
      setTimeout(() => {
        loadingData.value = true
      }, 1000)
    }
  }
}

// 初始化数据
const initPushVideo = async () => {
  await loadVideoData(false)
  
  // 初始加载后再加载一页数据
  if (videoList.value.length > 0 && !error.value) {
    await nextTick()
    await loadVideoData(true)
  }
}

// 滚动处理
const handleScroll = debounce((e) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target
  
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    if (loadingData.value && !dataNotMore.value && !error.value) {
      loadVideoData(true)
    }
  }
}, 100)

// 手动重试
const retryLoad = () => {
  error.value = null
  retryCount.value = 0
  dataNotMore.value = false
  initPushVideo()
}

// 跳转到用户页面
const handlePersonInfo = (userId) => {
  // TODO: 实现用户页面跳转逻辑
  console.log('Navigate to user:', userId)
}

// 生命周期
onMounted(() => {
  initPushVideo()
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
})
</script>

<style scoped>
@import "@/assets/styles/discover.scss";
</style>
