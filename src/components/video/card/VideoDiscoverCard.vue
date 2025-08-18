<template>
  <div class="video-card" :class="{ 'is-playing': isPlaying }">
    <!-- 视频封面区域 -->
    <div class="video-cover" ref="coverRef" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <!-- 封面图片 -->
      <div v-if="!isPlaying" class="cover-container">
        <el-image :src="video.coverImage" :alt="video.videoTitle" class="cover-image" fit="cover" loading="lazy"
          @error="handleImageError">
          <template #error>
            <div class="image-error">
              <el-icon>
                <Picture />
              </el-icon>
              <span>图片加载失败</span>
            </div>
          </template>
        </el-image>

        <!-- 视频时长 -->
        <div v-if="video.publishType === '0' && formattedDuration" class="duration-badge">
          {{ formattedDuration }}
        </div>

        <!-- 内容类型标签 -->
        <div v-if="video.publishType === '1'" class="type-badge">
          <el-icon>
            <Picture />
          </el-icon>
          <span>图文</span>
        </div>
      </div>

      <!-- hover时的立即播放区域 -->
      <div v-if="isPlaying" class="player-container">
        <!-- 直接在封面区域播放，不需要背景模糊层 -->
        <ImagePlayer v-if="video.publishType === '1'" :image-list="video.imageList" :height="playerHeight"
          class="image-player" />
        <VideoPlayer v-else :video="video" class="video-player" />
      </div>
    </div>

    <!-- 视频信息区域 -->
    <div class="video-info">
      <h3 class="video-title" :title="video.videoTitle" @click="handleVideoPlayDialog">
        {{ video.videoTitle }}
      </h3>

      <div class="video-meta">
        <div class="author-info">
          <el-avatar :src="video.userAvatar" :size="36" class="author-avatar">
            <el-icon>
              <User />
            </el-icon>
          </el-avatar>
          <span class="author-name">{{ video.userNickName }}</span>
        </div>

        <div class="publish-time">
          {{ smartDateFormat(video.createTime) }}
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="video.tags && video.tags.length" class="tags">
        <el-tag v-for="tag in video.tags.slice(0, 3)" :key="tag" size="small" type="info" effect="plain">
          {{ tag }}
        </el-tag>
      </div>

      <!-- 互动数据 -->
      <div class="interaction-stats">
        <div class="stat-group">
          <el-icon>
            <View />
          </el-icon>
          <span>{{ formatNumber(video.viewNum) }}</span>
        </div>
        <div class="stat-group">
          <el-icon>
            <Star />
          </el-icon>
          <span>{{ formatNumber(video.likeNum) }}</span>
        </div>
        <div class="stat-group">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span>{{ formatNumber(video.commentNum) }}</span>
        </div>
      </div>
    </div>


  </div>
  <!-- 全屏播放对话框 -->
  <el-dialog v-model="dialogVisible" :modal="false" custom-class="user-video-dialog" append-to-body fullscreen
    :destroy-on-close="true" align-center>
    <VideoPlayDialog :dialog-video="video" @dialog-visible="handleDialogVisible" />
  </el-dialog>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import {
  Picture,
  VideoPlay,
  View,
  Star,
  User,
  ChatDotRound,
  FullScreen
} from '@element-plus/icons-vue'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import ImagePlayer from '@/components/video/ImagePlayer.vue'
import VideoPlayDialog from '@/components/video/VideoPlayDialog.vue'

// Props
const props = defineProps({
  video: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 响应式数据
const isPlaying = ref(false)
const dialogVisible = ref(false)
const playerHeight = ref(0)
const coverRef = ref(null)

// 计算属性
const formattedDuration = computed(() => {
  return formatDuration(props.video.videoInfo)
})

// 鼠标事件处理
const handleMouseEnter = async () => {
  isPlaying.value = true

  if (props.video.publishType === '1' && coverRef.value) {
    await nextTick()
    playerHeight.value = coverRef.value.clientHeight
  }
}

const handleMouseLeave = () => {
  isPlaying.value = false
}

// 图片加载错误处理
const handleImageError = () => {
  console.warn('封面图片加载失败:', props.video.coverImage)
}

// 视频播放对话框
const handleVideoPlayDialog = (e) => {
  // 阻止事件冒泡
  e.stopPropagation()
  dialogVisible.value = true
}

const handleDialogVisible = (visible) => {
  dialogVisible.value = visible
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
</script>

<style scoped>
.video-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &.is-playing {
    .video-cover {
      .cover-container {
        .cover-image {
          transform: scale(1.05);
        }
      }
    }
  }
}

/* 视频封面区域 */
.video-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

/* 封面容器 */
.cover-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--el-text-color-placeholder);
  background: var(--el-fill-color-light);

  .el-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  span {
    font-size: 12px;
  }
}


/* 时长标签 */
.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* 类型标签 */
.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--el-color-warning);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(10px);

  .el-icon {
    font-size: 12px;
  }
}

/* 播放器容器 */
.player-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.image-player,
.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

/* 视频信息区域 */
.video-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-title {
  font-weight: 600;
  line-height: 1.4;
  color: var(--el-text-color-primary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.author-avatar {
  flex-shrink: 0;
}

.author-name {
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publish-time {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
}

/* 标签 */
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 互动数据 */
.interaction-stats {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;

  .el-icon {
    font-size: 14px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-card {
    border-radius: 8px;

    &:hover {
      transform: none;
    }
  }

  .video-cover {
    border-radius: 8px 8px 0 0;
  }

  .video-info {
    padding: 12px;
    gap: 8px;
  }

  .video-title {
    font-size: 13px;
  }

  .interaction-stats {
    gap: 12px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .video-card {
    background: var(--el-bg-color-page);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
  }

  .play-button {
    background: rgba(0, 0, 0, 0.8);
    color: white;

    &:hover {
      background: rgba(0, 0, 0, 0.9);
    }
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {

  .video-card,
  .cover-image,
  .cover-overlay,
  .play-button {
    transition: none;
  }
}

/* 全屏播放提示 */
.fullscreen-hint {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.player-container:hover .fullscreen-hint {
  opacity: 1;
  transform: translateY(0);
}

.fullscreen-hint .el-icon {
  font-size: 14px;
}

/* 播放器样式覆盖 */
:deep(.d-player-wrap .d-player-control) {
  height: 10px !important;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  display: none !important;
}
</style>
