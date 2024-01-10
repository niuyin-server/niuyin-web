<template>
  <div class="follow-container" style="display: flex;">
    <el-scrollbar style="width: 15%;">
      <el-card class="user-card"
               v-for="item in followList"
               :key="item.userId"
               shadow="hover">
        <div class="user-info" @click="getFollowedVideoList(item.userId)">
          <el-avatar class="user-avatar"
                     v-if="item.avatar"
                     :src="item.avatar"
                     lazy/>
          <el-avatar v-else :icon="UserFilled"/>
          <div class="user-nickname dn-phone">
            <p class="nickname">{{ item.nickName }}</p>
          </div>
        </div>
      </el-card>
      <el-empty v-show="followTotal<=0" description="暂无数据"/>
    </el-scrollbar>
    <div class="video-container" style="width: 85%">
      <VideoPlayerCarousel
          v-if="showVideoPlayer"
          :loading="loading"
          :video-list="videoList"
          @reloadVideoFeed="reloadVideoFeedEmit"/>
    </div>
  </div>
</template>

<script>
import VideoPlayerCarousel from "@/components/video/VideoPlayerCarousel.vue";
import {UserFilled} from "@element-plus/icons-vue";
import {videoUserpage} from "@/api/video"
import {followPageList, followVideoFeed} from '@/api/social'

export default {
  name: "Follow",
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  components: {VideoPlayerCarousel},
  data() {
    return {
      loading: true,
      showVideoPlayer: true,
      followQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      followTotal: undefined,
      followList: [],
      videoList: [],
      userPageQueryParams: {
        videoTitle: "",
        pageNum: 1,
        pageSize: 10,
      },
      queryParams: {
        lastTime: null,
      },
      dataNotMore: false,
    };
  },
  created() {
    this.getFollowList()
    this.getFollowVideoFeed()
  },
  methods: {
    getFollowList() {
      followPageList(this.followQueryParams).then(res => {
        if (res.code === 200) {
          this.followList = res.rows
          this.followTotal = res.total
        }
      })
    },
    getFollowedVideoList(userId) {
      this.userPageQueryParams.userId = userId
      videoUserpage(this.userPageQueryParams).then(res => {
        if (res.code === 200) {
          this.videoList = res.rows
          this.showVideoPlayer = true
        }
      })
    },
    reloadVideoFeedEmit(val) {
      console.log("reloadVideoFeedEmit" + val)
      this.getFollowVideoFeed()
    },
    // 获取关注视频流
    getFollowVideoFeed() {
      this.loading = true
      followVideoFeed(this.queryParams).then(res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            this.loading = false
            this.dataNotMore = true
          }
          this.videoList = res.data
          this.queryParams.lastTime = new Date(this.videoList[this.videoList.length - 1].createTime).getTime()
          this.loading = false
          this.showVideoPlayer = true
          console.log(this.queryParams.lastTime)
        }
      })
    },
  }
};
</script>

<style>
.follow-container {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
}

.user-card {
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;

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

.user-card:hover {
  background-color: rgba(134, 128, 128, 0.55);
  backdrop-filter: blur(10px);
}
</style>
