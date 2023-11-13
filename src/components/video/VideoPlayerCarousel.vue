<template>
  <el-carousel class="video-player"
               ref="carousel"
               :element-loading-spinner="true"
               direction="vertical"
               :autoplay="false"
               :loop="true"
               indicator-position="none"
               @keydown="keyDown"
               @mousewheel="rollScroll($event)"
               @change="carouselChange"
               @ended="carouselEnd">
    <el-carousel-item v-for="item in videoList" :key="item">
      <div class="video-box">
        <div class="video-container" :style="{ backgroundImage: `url(${item.coverImage})` }">
          <!--          <video class="videoPlayer"-->
          <!--                 id="videoPlayer"-->
          <!--                 :src="item.videoUrl"-->
          <!--                 v-if="videoDisplay"-->
          <!--                 controls/>-->
          <VideoPlayer v-if="videoDisplay" class="videoPlayer" id="videoPlayer" :video-url="item.videoUrl"
                       :cover-image="item.coverImage"/>
          <div class="video-operate">
            <div class="operate-area">
              <div class="video-author"></div>
              <div class="op">
                <i v-if="item.weatherLike" class="iconfont icon-like-ed icon-36 operate-icon"
                   @click="videoLikeClick(item.videoId)"></i>
                <i v-else class="iconfont icon-like icon-36 operate-icon"
                   @click="videoLikeClick(item.videoId)"></i>
                <div style="text-align: center;color: white">{{ item.likeNum }}</div>
              </div>
              <div class="op">
                <i class="iconfont icon-comment icon-36 operate-icon"
                   @click="videoCommentClick(item.videoId)"></i>
                <div style="text-align: center;color: white">{{ item.commentNum }}</div>
              </div>
              <div class="op">
                <i v-if="item.weatherFavorite" class="iconfont icon-favorite-ed icon-36 operate-icon"
                   @click="videoFavoriteClick(item.videoId)"></i>
                <i v-else class="iconfont icon-favorite icon-36 operate-icon"
                   @click="videoFavoriteClick(item.videoId)"></i>
                <div class="video-nums cw" style="text-align: center;">{{ item.favoritesNum }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="videoinfo-container">
          <div class="video-info" :title="item.videoTitle">
            <p class="video-title">{{ item.videoTitle }}</p>
            <div class="userinfo">
              <div class="user-avatar">
                <img class="user-avatar" :src="item.userAvatar">
                <el-button v-if="!item.weatherFollow" @click="handleFollow(item.userId)">关注</el-button>
              </div>
              <span class="username">{{ item.userNickName }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-carousel-item>
    <!-- 视频评论抽屉 -->
    <el-drawer class="video-sidebar"
               v-model="drawer"
               v-if="showVideoComment"
               :show-close="false"
               @mousewheel.stop
               :before-close="videoCommentTree=null">
      <template #header="{ close, titleId, titleClass }">
        <!--                <h2 class="cw" :id="titleId" :class="titleClass">评论<span>({{ item.commentNum }})</span></h2>-->
        <h2 class="cw" :id="titleId" :class="titleClass">评论</h2>
        <el-button circle class="cb" :icon="Close" type="info" @click="close">
        </el-button>
      </template>
      <VideoComment :video-id="videoId"
                    :show="true"
                    @emitUpdateVideoCommentNum="updateVideoCommentNumEmit"/>
    </el-drawer>
  </el-carousel>
</template>
<script>
import {
  ChatDotRound, ChromeFilled, Close
} from '@element-plus/icons-vue'
import {likeVideo} from '@/api/behave.js'
import {followUser} from '@/api/social.js'
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import VideoComment from "@/components/video/comment/VideoComment.vue";

export default {
  name: 'VideoPlayerCarousel',
  components: {VideoPlayer, VideoComment},
  computed: {
    ChatDotRound() {
      return ChatDotRound
    },
    ChromeFilled() {
      return ChromeFilled
    },
    Close() {
      return Close
    }
  },
  props: {
    videoList: Array,
  },
  data() {
    return {
      showVideo: true,
      timeOut: null,
      drawer: false,
      commentInput: '',
      // 视频评论查询参数
      commentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        videoId: undefined,
      },
      commentTotal: 0,
      videoId: '',
      videoCommentTree: [],
      showVideoComment: false, // 控制评论子组件显隐
      videoDisplay: true
    }
  },
  emits: ['reloadVideoFeed'],
  mounted() {
  },
  methods: {
    handleFollow(userId) {
      followUser(userId).then(res => {
        if (res.code === 200) {
          this.$message.success('关注成功')
        }
      })
    },
    videoLikeClick(videoId) {
      likeVideo(videoId).then(res => {
        if (res.code === 200) {
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              // 设置为已点赞
              item.weatherLike = !item.weatherLike
              if (item.weatherLike) {
                item.likeNum += 1
              } else {
                item.likeNum -= 1
              }
            }
          })
        }
      })
    },
    videoFavoriteClick(videoId) {
    },
    videoCommentClick(videoId) {
      this.videoId = videoId
      this.drawer = true
      this.showVideoComment = true
    },
    // 接收子组件增加视频评论传值
    updateVideoCommentNumEmit(videoId) {
      this.videoList.forEach((item, index) => {
        if (item.videoId === videoId) {
          // 评论数+1
          item.commentNum += 1
        }
      })
    },
    keyDown(e) {
      if (e.keyCode === 38) {
        console.log("按下了方向键--上")
      }
      if (e.keyCode === 40) {
        const _that = this;
        this.drawer = false
        this.showVideoComment = false
        if (!_that.timeOut) {
          _that.timeOut = setTimeout(() => {
            _that.timeOut = null;
            _that.$refs.carousel.next()
          }, 1000);
        }
      }
      if (e.keyCode === 37) {
        console.log("按下了方向键--左")
      }
      if (e.keyCode === 39) {
        console.log("按下了方向键--右")
      }
    },
    // 切换视频暂停视频
    carouselChange(newVal, oldVal) {
      console.log(newVal + "carouselChange" + oldVal)
      const videos = document.getElementsByClassName("d-player-video-main");
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
          // videos[i].load();
          console.log(videos[i])
        }, 1);
      }
      if (oldVal - newVal === videos.length - 1) {
        console.log("一个轮回")
        this.$emit("reloadVideoFeed", true)
      }
    },
    carouselEnd() {
      console.log("end")
    },
    rollScroll(event) {
      const _that = this;
      // chrome、ie使用的wheelDelta，火狐使用detail
      const scrollVal = event.wheelDelta || event.detail;
      // 节流
      if (!_that.timeOut) {
        this.drawer = false
        this.showVideoComment = false
        _that.timeOut = setTimeout(() => {
          _that.timeOut = null;
          scrollVal > 0
              ? _that.$refs.carousel.prev()
              : _that.$refs.carousel.next();
        }, 1000);
      } else {
      }
    },

  },
}
</script>
<style scoped>
.video-player {
  width: 100%;
  border-radius: 1rem;
  height: 100%;
  backdrop-filter: blur(20px);
}

.video-container * {
  border: 0;
  margin: 0;
  padding: 0;
  vertical-align: baseline;
}

.video-box {
  height: 100%;
  width: 100%;
  transition: all 0.5s;

  .video-container {
    width: 100%;
    float: left;
    border-radius: 1rem;
    margin: 0 auto;
    height: 100%;
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .videoPlayer {
      height: 100%;
      width: 100%;
      backdrop-filter: blur(10px);
      border-radius: 1rem;
    }

    .video-operate {
      bottom: 60px;
      padding-right: 38px;
      z-index: 11;
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: flex-end;
      position: absolute;
      right: 0;

      .operate-area {
        align-items: center;
        display: flex;
        filter: drop-shadow(0 0 3px rgba(0, 0, 0, .3));
        flex-direction: column;
        flex-shrink: 0;
        justify-content: center;
        margin-bottom: 3rem;
        position: relative;

        .video-author {
          vertical-align: bottom;
          position: relative;
        }

        .op {
          vertical-align: bottom;
          position: relative;
          padding: 10px;
          cursor: pointer;

          .iconfont {
            color: white;
          }

          .video-nums {
            align-items: center;
            color: #fff;
            display: flex;
            font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
            font-size: 15px;
            font-weight: 500;
            justify-content: center;
            line-height: 23px;
            opacity: .9;
          }

        }
      }
    }
  }

  .videoinfo-container {
    display: none;
    transition: all 0.5s;

    .video-info {
      position: absolute;
      left: 0;
      top: 0;
      color: white;
      width: 100%;
      padding: 1rem;
      display: flex;
      justify-content: space-between;

      .video-title {

      }

      .userinfo {
        text-align: center;
        display: flex;
        border-radius: 10px;

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 32px;
        }

        .username {
          line-height: 50px;
          padding: 0 10px;
        }
      }
    }

  }

}

.operate-icon {
  font-size: 30px;
  text-align: center;
  transition: font-size 0.2s linear, width 0.2s linear;
  display: inline-block;
  vertical-align: middle;
}

.operate-icon:hover {
  font-size: 35px;
  color: red;
}


.video-box:hover .videoinfo-container {
  display: block;
  transition: all 0.5s;
}

.video-sidebar {
  backdrop-filter: blur(10px);
  background-color: #00000059;
}

/*评论抽屉*/
.comment-container {
  margin: 1rem 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.133) 0 1.6px 3.6px 0, rgba(0, 0, 0, 0.11) 0 0.3px 0.9px 0;
}

.user-info {
  display: flex;
  align-items: center;

  .user-nickname {
    padding-left: 10px;

    .nickname {
      color: gray;
      font-size: 0.8rem;
    }

    .create-time {
      padding-left: 0;
    }
  }
}

.comment-children {
  padding-left: 50px;
}

.comment-content {
  padding-left: 50px;
}

.aite {
  padding-left: 10px;
  color: blue;
}

.comment-input-area {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>

