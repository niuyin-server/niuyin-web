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
          <video class="videoPlayer"
                 :src="item.videoUrl"
                 webkit-playsinline="true"
                 playsinline="true"
                 x-webkit-airplay="allow"
                 x5-playsinline
                 controls/>
          <div class="video-operate">
            <el-button @click="videoLikeClick(item.videoId)"
                       :icon="Apple"
                       circle/>
            <span style="text-align: center;color: white">{{ item.likeNum }}</span>
            <el-button style="margin-left: 0;margin-top: 0.5rem"
                       @click="videoCommentClick(item.videoId)"
                       :icon="ChatDotRound"
                       circle/>
            <span style="text-align: center;color: white">{{ item.commentNum }}</span>
            <el-button style="margin-left: 0;margin-top: 0.5rem"
                       @click="videoFavoriteClick(item.videoId)"
                       :icon="Star" circle/>
            <span style="text-align: center;color: white">{{ item.favoritesNum }}</span>
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
      <el-drawer class="video-sidebar"
                 v-model="drawer"
                 :show-close="false"
                 @mousewheel.stop
                 :before-close="videoCommentTree=null">
        <template #header="{ close, titleId, titleClass }">
          <h2 :id="titleId" :class="titleClass">评论<span>({{ item.commentNum }})</span></h2>
          <el-button circle :icon="Close" type="info" @click="close">
          </el-button>
        </template>
        <el-scrollbar>
          <div class="video-comment-tree" v-for="(item, index) in videoCommentTree" :key="item.commentId">
            <div class="comment-container">
              <el-card class="comment-info">
                <div class="user-info">
                  <el-image class="user-avatar" :src="item.avatar" alt="" lazy></el-image>
                  <div class="user-nickname">
                    <p class="nickname">{{ item.nickName }}</p>
                    <span style="color: gray;font-size: 0.7rem" class="create-time">{{
                        item.createTime
                      }}</span>
                  </div>
                </div>
                <div class="comment-content">
                  <p style="color: white;font-size: 0.8rem">{{ item.content }}</p>
                </div>
                <!-- 二级评论 -->
                <div class="comment-children">
                  <div class="comment-container" v-for="(child, index) in item.children" :key="child.commentId">
                    <div class="user-info">
                      <el-image class="user-avatar" :src="child.avatar" alt="" lazy></el-image>
                      <div class="user-nickname">
                        <p class="nickname">{{ child.nickName }}<span class="aite" v-if="child.replayUserId != null">{{
                            '@' + child.replayUserNickName
                          }}</span>
                        </p>
                        <span style="color: gray;" class="create-time">{{ parseTime(child.createTime) }}</span>
                      </div>
                    </div>
                    <div class="comment-content">
                      <p style="color: white">{{ child.content }}</p>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
          <el-empty v-show="commentTotal<=0" description="暂无评论"/>
          <el-pagination v-show="commentTotal>0"
                         :total="commentTotal"
                         background
                         layout="prev, pager, next"
                         :page.sync="commentQueryParams.pageNum"
                         :limit.sync="commentQueryParams.pageSize" @pagination="getCommentList"/>
        </el-scrollbar>
        <div class="comment-input-area">
          <el-input
              slot="reference"
              v-model="commentInput"
              clearable
              @input="change($event)"
              placeholder="留下你的精彩评论吧"
          >
            <template #append>
              <el-button @click="handleCommentClick(item.videoId)" :icon="ChromeFilled"/>
            </template>
          </el-input>
        </div>
      </el-drawer>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import {
  Apple, ChatDotRound, ChromeFilled, Close, Star
} from '@element-plus/icons-vue'
import {videoCommentPageList, addVideoComment, likeVideo} from '@/api/behave.js'
import {followUser} from '@/api/social.js'

export default {
  name: 'VideoPlayerCarousel',
  computed: {
    Apple() {
      return Apple
    },
    Star() {
      return Star
    },
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
    }
  },
  emits: ['reloadVideoFeed'],
  mounted() {
  },
  methods: {
    handleFollow(userId) {
      console.log(userId)
      followUser(userId).then(res => {
        if (res.code === 200) {
          this.$message.success('关注成功')
        }
      })
    },
    change(e) {
      this.$forceUpdate()
    },
    videoLikeClick(videoId) {
      likeVideo(videoId).then(res => {
        if (res.code === 200) {
          this.$message.success('点赞成功')
        }
      })
    },
    videoFavoriteClick(videoId) {
    },
    videoCommentClick(videoId) {
      this.commentQueryParams.videoId = videoId
      this.videoId = videoId
      this.drawer = true
      videoCommentPageList(this.commentQueryParams).then(res => {
        if (res.code === 200) {
          this.videoCommentTree = res.rows
          this.commentTotal = res.total
        }
      })
    },
    getCommentList() {
      this.commentQueryParams.videoId = this.videoId
      videoCommentPageList(this.commentQueryParams).then(res => {
        this.drawer = true
        this.videoCommentTree = res.rows;
        this.commentTotal = res.total;
      })
    },
    handleCommentClick(videoId) {
      const data = {
        "videoId": videoId,
        "content": this.commentInput
      }
      addVideoComment(data).then(res => {
        if (res.code === 200) {
          this.getCommentList();
        }
      })
    },
    keyDown(e) {
      // 方向键--上
      if (e.keyCode == 38) {
        console.log("按下了方向键--上")
      }
      // 方向键--下
      if (e.keyCode == 40) {
        const _that = this;
        if (!_that.timeOut) {
          _that.timeOut = setTimeout(() => {
            _that.timeOut = null;
            console.log("keyDown")
            _that.$refs.carousel.next()
          }, 1000);
        }
      }
      // 方向键--左
      if (e.keyCode == 37) {
        console.log("按下了方向键--左")
      }
      // 方向键--右
      if (e.keyCode == 39) {
        console.log("按下了方向键--右")
      }

    },
    // 切换视频暂停视频
    carouselChange(newVal, oldVal) {
      // console.log(newVal + "carouselChange" + oldVal)
      const videos = document.getElementsByClassName("videoPlayer");
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
          // videos[i].load();
        }, 10);
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

    .videoPlayer {
      height: 100%;
      width: 100%;
      backdrop-filter: blur(10px);
      border-radius: 1rem;
    }

    .video-operate {
      position: absolute;
      right: 1rem;
      cursor: pointer;
      top: 40%;
      display: flex;
      flex-direction: column;
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
  box-shadow: 0 0 2px gray;
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

