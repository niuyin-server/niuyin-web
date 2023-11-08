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
          <div class="user-nickname">
            <p class="nickname">{{ item.nickName }}</p>
          </div>
        </div>
      </el-card>
      <el-empty v-show="followTotal<=0" description="暂无数据"/>
    </el-scrollbar>
    <div class="video-container" style="width: 85%">
      <video-player-carousel
          v-if="showVideoPlayer"
          :video-list="videoList"
          @reloadVideoFeed="reloadVideoFeedEmit"
      />
    </div>
  </div>
</template>

<script>
import {followPageList} from '@/api/social.js'
import VideoPlayerCarousel from "@/components/video/VideoPlayerCarousel.vue";
import {videoUserpage} from "@/api/video"
import {UserFilled} from "@element-plus/icons-vue";

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
    };
  },
  created() {
    this.getFollowList()
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
      this.showVideoPlayer = val;
      this.$nextTick(() => {
        this.showVideoPlayer = true;
        this.getVideoFeed();
      });
    },
  }
};
</script>

<style scoped>
.follow-container {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background-color: aliceblue
}

.user-card {
  border-radius: 1rem;
  padding: 2px 0.5rem;
  cursor: pointer;

  .user-info {
    display: flex;
    align-items: center;

    .user-nickname {
      padding-left: 10px;

      .nickname {
        color: black;
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
