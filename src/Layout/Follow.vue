<template>
  <div class="follow-container">
    <div class="follow-left" :style="'width:' + followListWidth">
      <div class="p5-10 flex-between tac">
        <span v-if="followExpand" class="fs9 fw600 flex-center" style="flex: 1 1">我的关注（{{ followTotal }}）</span>
        <span class="cp flex-center" style="margin: 0 auto" @click="handleExpandFold()">
          <el-tooltip class="box-item" effect="dark" :auto-close="1000" content="展开/收起" placement="top">
            <svg v-if="followExpand" class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold"></use>
            </svg>
            <svg v-else class="icon" aria-hidden="true">
              <use xlink:href="#icon-expand"></use>
            </svg></el-tooltip>
        </span>
      </div>
      <el-scrollbar class="p5-10" v-loading="followListLoading">
        <div :class="{ 'user-card user-card-cur': item.userId === curPlayUserId, 'user-card': true }"
          v-for="item in followList" :key="item.userId">
          <div class="user-info flex-start pr" @click="getFollowedVideoList(item.userId)">
            <el-avatar class="user-avatar" v-if="item.avatar" :src="item.avatar" lazy />
            <el-avatar v-else :icon="UserFilled" />
            <div v-if="followExpand" class="user-nickname">
              <p class="nickname one-line">{{ item.nickName }}</p>
            </div>
            <span v-if="curPlayUserId === item.userId" class="cur-play-dot pa"></span>
          </div>
        </div>
        <!-- 无限滚动观察目标元素 -->
        <div ref="loadMoreTrigger" v-if="!followListDataNotMore" class="load-more-trigger">
          <div v-if="followListLoading" class="loading-indicator">
            <el-icon class="is-loading">
              <Loading />
            </el-icon>
            <span>加载中...</span>
          </div>
        </div>
        <div v-if="followListDataNotMore">
          <el-divider>到底了</el-divider>
        </div>
        <el-empty v-show="followTotal <= 0" description="暂无数据" />
      </el-scrollbar>
    </div>
    <!--    <div class="video-container"-->
    <!--         :style="'width:calc(100% - '+followListWidth+');'"> -->
    <div class="video-container" style="flex: 1;width: 100%"><!--width: 100%不会有动画效果-->
      <VideoPlayerCarousel v-if="showVideoPlayer" :loading="loading" :video-list="videoList"
        @reloadVideoFeed="reloadVideoFeedEmit" />
      <el-empty v-if="dataNotMore" description="暂无关注视频动态" />
    </div>
  </div>
</template>

<script>
import VideoPlayerCarousel from "@/components/video/VideoPlayerCarousel.vue";
import { UserFilled, Loading } from "@element-plus/icons-vue";
import { videoUserpage } from "@/api/video"
import { followPageList, followVideoFeed, initUserInBox } from '@/api/social'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

export default {
  name: "Follow",
  computed: {
    UserFilled() {
      return UserFilled
    },
    Loading() {
      return Loading
    }
  },
  components: { VideoPlayerCarousel },
  data() {
    return {
      loading: true,
      showVideoPlayer: true,
      followQueryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      followTotal: null,
      followList: [],
      followListDataNotMore: false,
      loadingFollowListData: true,
      videoList: [],
      videoTotal: 0,
      userPageQueryParams: {
        videoTitle: "",
        pageNum: 1,
        pageSize: 10,
      },
      queryParams: {
        lastTime: null,
      },
      dataNotMore: false,
      followListLoading: true,
      followExpand: true, // 默认展开，false：fold
      followListWidth: '208px',
      curPlayUserId: null,
      curPlayUserVideoNotMore: false,
      intersectionObserver: null, // IntersectionObserver实例
    };
  },
  created() {
    this.getInitUserInBox()
    this.getFollowList()
    this.getFollowVideoFeed()
  },
  mounted() {
    // 初始化IntersectionObserver
    this.initIntersectionObserver()
  },
  methods: {
    getInitUserInBox() {
      initUserInBox().then(res => {
        if (res.code === 200) {

        }
      })
    },
    // 获取关注用户列表
    getFollowList() {
      if (this.followListDataNotMore) {
        return
      }
      this.followListLoading = true
      followPageList(this.followQueryParams).then(res => {
        if (res.code === 200) {
          this.followList = this.followList.concat(res.rows)
          this.followTotal = res.total
          if (res.rows === null || res.rows.length == 0) {
            this.followListDataNotMore = true
          } else {
            this.followListDataNotMore = false
          }
        }
        this.followListLoading = false
      })
    },
    getFollowedVideoList(userId) {
      this.userPageQueryParams.userId = userId
      this.curPlayUserId = userId
      this.curPlayUserVideoNotMore = false
      this.loading = true
      this.followQueryParams = {
        pageNum: 1,
        pageSize: 20,
      }
      this.dataNotMore = false
      videoUserpage(this.userPageQueryParams).then(res => {
        if (res.code === 200) {
          console.log(typeof res.rows)
          if (res.rows === null) {
            this.$message.info("暂无更多视频")
          } else {
            this.videoList = res.rows
          }
          this.showVideoPlayer = true
          this.loading = false
        }
      })
    },
    reloadVideoFeedEmit(val) {
      if (this.curPlayUserId !== null) {
        this.userPageQueryParams.pageNum++
        this.getFollowedVideoList(this.curPlayUserId)
      } else {
        this.getFollowVideoFeed()
      }
    },
    // 获取关注视频流
    getFollowVideoFeed() {
      this.loading = true
      followVideoFeed(this.queryParams).then(res => {
        if (res.code === 200) {
          if (res.data === null || res.data.length === 0) {
            this.loading = false
            this.dataNotMore = true
            this.showVideoPlayer = false
          }
          this.videoList = res.data
          this.queryParams.lastTime = new Date(this.videoList[this.videoList.length - 1].createTime).getTime()
          this.loading = false
          this.showVideoPlayer = true
          // console.log(this.queryParams.lastTime)
        }
      })
    },
    handleExpandFold() {
      this.followExpand = !this.followExpand
      if (this.followExpand) {
        this.followListWidth = '208px'
      } else {
        this.followListWidth = '76px'
      }
    },
    // 初始化IntersectionObserver
    initIntersectionObserver() {
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect()
      }

      this.intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !this.followListDataNotMore && this.loadingFollowListData) {
          this.followQueryParams.pageNum++
          this.getFollowList()
          this.loadingFollowListData = false
          setTimeout(() => {
            // 流控
            this.loadingFollowListData = true
          }, 1000)
        }
      }, {
        root: null,
        rootMargin: '20px',
        threshold: 0.1
      })

      // 观察目标元素
      this.$nextTick(() => {
        const target = this.$refs.loadMoreTrigger
        if (target) {
          this.intersectionObserver.observe(target)
        }
      })
    },
  },
  destroyed() {
    // 清理IntersectionObserver
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
      this.intersectionObserver = null
    }
  }
};
</script>

<style>
.follow-container {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  display: flex;
  transition: all .3s ease-in-out;
}

.user-card {
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all .3s ease;

  .user-info {
    display: flex;
    align-items: center;

    .user-nickname {
      padding-left: 10px;

      .nickname {
        font-size: 0.8rem;
      }

    }
  }
}

.user-card-cur {
  background-color: var(--bg-aside-a);
  backdrop-filter: blur(10px);
}

.user-card:hover {
  background-color: var(--bg-aside-a);
  backdrop-filter: blur(10px);
}

.follow-left {
  display: flex;
  flex-flow: column;
}

.video-container {
  transition: all .3s ease-in-out;
}

.cur-play-dot {
  position: absolute;
  right: -5px;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--niuyin-primary-color);
}

.load-more-trigger {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}
</style>
