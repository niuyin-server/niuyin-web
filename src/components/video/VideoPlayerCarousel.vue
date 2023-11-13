<template>
  <div class="wh100 pr flex-between custom-loading-svg"
       v-loading="loading"
       :element-loading-svg="svg"
       element-loading-svg-view-box="-10, -10, 50, 50">
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
            <VideoPlayer v-if="videoDisplay"
                         class="videoPlayer"
                         id="videoPlayer"
                         :video-url="item.videoUrl"
                         :cover-image="item.coverImage"/>
            <!--          视频简介区域-->
            <div class="videoinfo-area">
              <div class="video-title one-line cw fs125 fw600">
                <span>@ </span><span v-html="item.userNickName" class="cp"
                                     @click="handleLinkUserInfo(item.userId)"></span>
                <span class="fs9 fw400 cg"> · {{ parseTime(item.createTime) }}</span>
              </div>
              <div v-html="item.videoTitle" class="video-title one-line cw fw400"></div>
              <div>
                <span v-for="tag in item.tags" class="video-tag fs8 cp">{{ ' #' + tag }}</span>
              </div>
            </div>
            <!--          视频点赞等操作区域-->
            <div class="video-operate">
              <div class="operate-area">
                <div class="video-author">
                  <el-avatar v-if="item.userAvatar"
                             class="user-avatar cp"
                             :size="64"
                             :src="item.userAvatar"
                             lazy/>
                  <el-avatar v-else
                             class="user-avatar cp"
                             :icon="UserFilled"/>
                  <span v-if="!item.weatherFollow" class="user-att cp operate-icon">
                  <i class="iconfont icon-attention fs24px" @click="handleAttUser(item.userId)"></i>
                </span>
                </div>
                <!--            点赞  -->
                <div class="op">
                  <i v-if="item.weatherLike" class="iconfont icon-like-ed icon-36 operate-icon"
                     @click="videoLikeClick(item.videoId)"></i>
                  <i v-else class="iconfont icon-like icon-36 operate-icon"
                     @click="videoLikeClick(item.videoId)"></i>
                  <div style="text-align: center;color: white">{{ item.likeNum }}</div>
                </div>
                <!--              评论-->
                <div class="op">
                  <i class="iconfont icon-comment icon-36 operate-icon"
                     @click="videoCommentClick(item.videoId)"></i>
                  <div style="text-align: center;color: white">{{ item.commentNum }}</div>
                </div>
                <!--              收藏-->
                <div class="op">
                  <i v-if="item.weatherFavorite" class="iconfont icon-favorite-ed icon-36 operate-icon"
                     @click="videoFavoriteClick(item.videoId)"></i>
                  <i v-else class="iconfont icon-favorite icon-36 operate-icon"
                     @click="videoFavoriteClick(item.videoId)"></i>
                  <div class="video-nums cw" style="text-align: center;">{{ item.favoritesNum }}</div>
                </div>
                <!--              分享-->
                <div class="op">
                  <i class="iconfont icon-share icon-36 operate-icon"></i>
                  <div class="video-nums cw" style="text-align: center;">{{ item.favoritesNum }}</div>
                </div>
                <div class="op">
                  <el-icon class="operate-icon"
                           :size="24"
                           color="white">
                    <MoreFilled/>
                  </el-icon>
                </div>
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
    <div class="player-playswitch flex-center">
      <div class="player-playswitch-tab">
        <div class="player-playswitch-prev cp" @click="handleVideoPrev">
          <el-icon color="#c0bdbd" :size="18">
            <ArrowUpBold/>
          </el-icon>
        </div>
        <div class="player-playswitch-next cp" @click="handleVideoNext">
          <el-icon color="#c0bdbd" :size="18">
            <ArrowDownBold/>
          </el-icon>
        </div>
      </div>
    </div>
    <div class="feedback">
      <div class="feedback-icon bgc211 flex-center cp">
        <el-icon color="#5a5a5a" :size="20">
          <QuestionFilled/>
        </el-icon>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ArrowDownBold,
  ArrowUpBold,
  ChatDotRound, ChromeFilled, Close, MoreFilled, QuestionFilled, UserFilled
} from '@element-plus/icons-vue'
import {likeVideo} from '@/api/behave.js'
import {followUser} from '@/api/social.js'
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import VideoComment from "@/components/video/comment/VideoComment.vue";

export default {
  name: 'VideoPlayerCarousel',
  components: {QuestionFilled, ArrowDownBold, ArrowUpBold, MoreFilled, VideoPlayer, VideoComment},
  computed: {
    UserFilled() {
      return UserFilled
    },
    ChatDotRound() {
      return ChatDotRound
    },
    ChromeFilled() {
      return ChromeFilled
    },
    Close() {
      return Close
    },
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
      const videos = document.getElementsByClassName("d-player-video-main");
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
          // videos[i].load();
          // console.log(videos[i])
        }, 1);
      }
      if (oldVal - newVal === videos.length - 1) {
        this.$emit("reloadVideoFeed", true)
      }
    },
    carouselEnd() {
      console.log("end")
    },
    // 鼠标滚轮事件
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
    // playswitch 上一个
    handleVideoPrev() {

    },
    // playswitch 下一个
    handleVideoNext() {
      const _that = this;
      this.drawer = false
      this.showVideoComment = false
      if (!_that.timeOut) {
        _that.timeOut = setTimeout(() => {
          _that.timeOut = null;
          _that.$refs.carousel.next()
        }, 500);
      }
    },
    // 跳转用户详情页面
    handleLinkUserInfo(userId) {
      console.log(userId)
    },
    // 关注用户
    handleAttUser(userId) {
      console.log(userId)
      // 将数组此条数据改为已关注 weatherFollow = true
    }

  },
}
</script>
<style scoped>
.video-player {
  width: 95%;
  border-radius: 1rem;
  height: 100%;
  backdrop-filter: blur(10px);

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

    .videoinfo-area {
      position: absolute;
      bottom: 60px;
      padding: 10px;
      left: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: self-start;

      .video-title {
        max-width: 95%;
      }
    }

    .video-operate {
      position: absolute;
      bottom: 60px;
      padding-right: 16px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      right: 0;

      .operate-area {
        align-items: center;
        display: flex;
        filter: drop-shadow(0 0 3px rgba(0, 0, 0, .3));
        flex-direction: column;
        flex-shrink: 0;
        justify-content: center;
        position: relative;

        .video-author {
          vertical-align: bottom;
          position: relative;
          padding: 10px 0;

          .user-avatar {
          //position: relative;
          }

          .user-att {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, 10%);
          }

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

.video-sidebar {
  backdrop-filter: blur(6px);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.133) 0 1.6px 3.6px 0, rgba(0, 0, 0, 0.11) 0 0.3px 0.9px 0;
}

.video-tag {
  color: gold;
}

.player-playswitch {
  width: 5%;
  z-index: 2;

  .player-playswitch-tab {
    background-color: rgba(242, 242, 243, 0.5);
    border-radius: 1.5rem;
    padding: 1px;

    &:hover {
      backdrop-filter: blur(5px);
    }

    .player-playswitch-prev {
      padding: 10px;
      transition: all 0.5s ease;

      &:hover .el-icon {
        --color: red !important;
      }
    }

    .player-playswitch-next {
      padding: 10px;
      transition: all 0.5s ease;

      &:hover .el-icon {
        --color: red !important;
      }
    }
  }
}

.feedback {
  position: fixed;
  bottom: 6px;
  right: 6px;

  .feedback-icon {
    padding: 10px;
    vertical-align: middle;
    border-radius: 2rem;
  }
}
</style>

