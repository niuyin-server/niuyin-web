<template>
  <div class="video-card">
    <div class="video-box pr oh">
      <div class="video-container" :style="{ backgroundImage: `url(${video.coverImage})` }">
        <!--            图文轮播-->
        <ImagePlayer v-if="video.publishType==='1'" :image-list="video.imageList"/>
        <!--            视频-->
        <VideoPlayer v-if="video.publishType==='0'"
                     class="videoPlayer"
                     :ref="'videoPlayer'+video.videoId"
                     :id="'videoPlayer'+video.videoId"
                     :video="video"
                     @click="handlePlayVideo(video.videoId)"
                     @videoOnPlay="emitVideoOnPlay"/>
        <!--            视频类型-->
        <div v-if="video.publishType==='1'" class="flex-center video-type-pics">
          <svg class="icon1rem" aria-hidden="true">
            <use xlink:href="#icon-pics"></use>
          </svg>
          <span class="type-desc fs7 fw500">图文</span>
        </div>
        <!--          视频简介区域-->
        <!--        <div class="videoinfo-area">-->
        <!--              定位信息-->
        <!--          <div v-if="video.positionFlag==='1'" class="video-position mtb5 flex-center">-->
        <!--            <svg class="icon mr5px" aria-hidden="true">-->
        <!--              <use xlink:href="#icon-position"></use>-->
        <!--            </svg>-->
        <!--            <span v-if="video.position.city" class="position-city fs9">{{ video.position.city }}</span>-->
        <!--            <span v-else class="position-city fs9">{{ video.position.province }}</span>-->
        <!--            <span class="position-dist fs9">{{ video.position.district }}</span>-->
        <!--            <span class="position-add fs9">{{ parseAddress(video.position) }}</span>-->
        <!--          </div>-->
        <!--              视频信息-->
        <!--          <div class="video-title one-line cw fs125 fw600">-->
        <!--            <span>@ </span><span v-html="video.userNickName" class="cp"-->
        <!--                                 @click="handleLinkUserInfo(video.userId)"></span>-->
        <!--          </div>-->
        <!--          <div v-html="video.videoTitle" class="video-title one-line cw fw400 mtb5"></div>-->
        <!--          <div>-->
        <!--            <span v-for="tag in video.tags" class="video-tag fs8 cp">{{ ' #' + tag }}</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--          视频点赞等操作区域-->
        <div class="video-operate">
          <div class="operate-area">
            <!--            点赞  -->
            <div class="op">
              <svg v-if="video.weatherLike" class="icon32 operate-svg" aria-hidden="true"
                   @click="videoLikeClick(video.videoId)">
                <use xlink:href="#icon-like-ed"></use>
              </svg>
              <svg v-else class="icon32 operate-svg" aria-hidden="true" @click="videoLikeClick(video.videoId)">
                <use xlink:href="#icon-like"></use>
              </svg>
              <div style="text-align: center;color: white">{{ video.likeNum }}</div>
            </div>
            <!--              评论-->
            <div class="op">
              <svg class="icon32 operate-svg" aria-hidden="true" @click="videoCommentClick(video.videoId)">
                <use xlink:href="#icon-comment"></use>
              </svg>
              <div style="text-align: center;color: white">{{ video.commentNum }}</div>
            </div>
            <!--              收藏-->
            <div class="op">
              <!--收藏按钮弹框-->
              <el-popover placement="right-end"
                          :width="300"
                          :ref="'favoritePop'+video.videoId">
                <!--收藏按钮根据是否收藏显示不同的状态-->
                <template #reference>
                  <svg v-if="video.weatherFavorite" class="icon32 operate-svg" aria-hidden="true"
                       @click="handleCancelFavoriteOver(video.videoId)"
                       @mouseover.stop="handleFavoriteOver(video.videoId)">
                    <use xlink:href="#icon-favorite-ed"></use>
                  </svg>
                  <svg v-else class="icon32 operate-svg" aria-hidden="true"
                       @mouseover.stop="handleFavoriteOver(video.videoId)"
                       @mouseleave.stop="handleFavoriteLeave(video.videoId)">
                    <use xlink:href="#icon-favorite"></use>
                  </svg>
                </template>
                <template #default>
                  <!--弹窗主体-->
                  <div class="p1rem" style="min-height: 12vh;">
                    <!--头部-->
                    <div class="flex-between mb5">
                      <span>选择收藏夹</span>
                      <!--新建文件夹按钮-->
                      <div>
                        <el-button class="tac" @click="dialogFormVisible = true">
                          <el-icon class="mr-5r" :size="16">
                            <CirclePlus/>
                          </el-icon>
                          新建
                        </el-button>
                      </div>
                    </div>
                    <!--卡片主题内容列表-->
                    <div class="favorite-container">
                      <el-checkbox-group v-model="favoriteChecked"
                                         @change="handleFavoriteCheckedChange">
                        <el-checkbox class="mb5 w100"
                                     v-for="item2 in userFavoriteList"
                                     border
                                     :key="item2.favoriteId"
                                     :label="item2.favoriteId"
                                     :name="item2.title">{{ item2.title }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <div class="favorite-op tac">
                      <!--                          已收藏-->
                      <!--                          <el-button v-if="item.weatherFavorite"-->
                      <!--                                     type="warning"-->
                      <!--                                     disabled>已收藏-->
                      <!--                          </el-button>-->
                      <!--                          <el-button v-else-->
                      <!--                                     type="info"-->
                      <!--                                     @click="handleOnlyFavoriteVideo(item.videoId)">仅收藏视频-->
                      <!--                          </el-button>-->
                      <el-button
                          type="info"
                          @click="handleOnlyFavoriteVideo(video.videoId)">仅收藏视频
                      </el-button>
                      <el-button type="primary"
                                 :disabled="favoriteBtn"
                                 @click="handleCollectVideo(video.videoId)">收藏至收藏夹
                      </el-button>
                    </div>
                  </div>
                </template>
              </el-popover>
              <div class="video-nums cw tac">{{ video.favoritesNum }}</div>
            </div>
            <!--              分享-->
            <div class="op">
              <svg class="icon32 operate-svg" aria-hidden="true">
                <use xlink:href="#icon-share"></use>
              </svg>
              <div class="video-nums cw tac">{{ video.favoritesNum }}</div>
            </div>
            <!--                更多-->
            <div class="op">
              <el-icon class="operate-icon"
                       :size="28"
                       color="white">
                <MoreFilled/>
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- 视频评论抽屉 -->
      <el-drawer v-model="drawer"
                 class="video-sidebar"
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
    </div>
  </div>
  <!--新建收藏夹提示框-->
  <el-dialog
      v-model="dialogFormVisible"
      title="新建收藏夹"
      width="400px"
      align-center>
    <!--收藏夹名称输入框-->
    <div>
      <div class="mb5">收藏夹封面</div>
      <div class="mtb5">收藏夹名称</div>
      <el-input v-model="userFavoriteForm.title"
                placeholder="收藏夹的名称"
                clearable
                maxlength="10"
                show-word-limit
                type="text"></el-input>
      <div class="mtb5">收藏夹描述</div>
      <el-input v-model="userFavoriteForm.description"
                placeholder="收藏夹的描述..."
                clearable
                maxlength="100"
                show-word-limit
                type="textarea"></el-input>
    </div>
    <div class="flex-between">
      <div class="mtb5">
        <p class="fs8">>设置为公开</p>
        <p class="fs7 cg">公开后有机会被推荐，帮助到更多人</p>
      </div>
      <div>
        <el-switch
            v-model="userFavoriteForm.showStatus"
            active-value="0"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>
    <div class="tac">
      <el-button class="w100" type="primary" @click="handleCreateFavorite">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import ImagePlayer from "@/components/video/ImagePlayer.vue";
import {
  ArrowDownBold,
  ArrowUpBold,
  ChatDotRound, ChromeFilled,
  CirclePlus, Close,
  MoreFilled,
  QuestionFilled,
  UserFilled
} from '@element-plus/icons-vue'
import {
  createFavorite,
  favoriteVideoToCollection,
  likeVideo,
  myFavoriteList,
  onlyFavoriteVideo, userUnFavoriteVideo,
  videoInWhoseCollection
} from '@/api/behave.js'
import {followUser} from '@/api/social.js'
import VideoComment from "@/components/video/comment/VideoComment.vue";

export default {
  name: "VideoSearchOneCard",
  components: {
    ImagePlayer, CirclePlus, QuestionFilled, ArrowDownBold, ArrowUpBold, MoreFilled, VideoPlayer, VideoComment
  },
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
    video: Object,
  },
  data() {
    return {
      dialogFormVisible: false,
      favoriteBtn: false,
      userFavoriteForm: {
        title: "",
        description: "",
        coverImage: "",
        showStatus: "0"
      },
      userFavoriteList: '',
      userFavoriteTotal: undefined,
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>`,
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
      videoDisplay: true,
      isLiked: false, // 是否已经快捷键点赞
      startIndex: 1,
      favoriteChecked: [],//已选收藏夹
      waitLoadMore: false,
      activeVideoId: undefined,
    }
  },
  created() {
  },
  methods: {
    // 鼠标悬停显示
    handleFavoriteOver(videoId) {
      // console.log("handleFavoriteShow" + videoId)
      // 查询登录用户的收藏夹列表
      myFavoriteList().then(res => {
        if (res.code === 200) {
          this.userFavoriteList = res.data
        }
      })
      // 查询当前视频在那些收藏夹
      videoInWhoseCollection(videoId).then(res => {
        if (res.code === 200) {
          this.favoriteChecked = res.data
        }
      })
      // 鼠标悬停事件改为显示
      this.$refs[`favoritePop${videoId}`].showPopper = true
    },
    // 鼠标离开后显示事件改为不显示
    handleFavoriteLeave(videoId) {
      this.$refs[`favoritePop${videoId}`].showPopper = false
    },
    // 点赞视频
    videoLikeClick(videoId) {
      // 设置为已点赞
      this.video.weatherLike = !this.video.weatherLike
      if (this.video.weatherLike) {
        this.video.likeNum += 1
      } else {
        this.video.likeNum -= 1
      }
      likeVideo(videoId).then(res => {
        if (res.code === 200) {

        } else {
          this.video.weatherLike = !this.video.weatherLike
          if (this.video.weatherLike) {
            this.video.likeNum += 1
          } else {
            this.video.likeNum -= 1
          }
        }
      })
    },
    // 查看视频评论
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
    // 切换视频暂停视频
    carouselChange(newVal, oldVal) {
      console.log("newVal=>" + newVal + "、oldVal=>" + oldVal + "、videoLength=>" + this.videoList.length)
      const videos = document.getElementsByClassName("d-player-video-main");
      for (let i = 0; i < videos.length; i++) {
        videos[i].pause();
      }
      if (newVal === this.videoList.length - 1) {
        this.waitLoadMore = true
      }
    },
    // 跳转用户详情页面
    handleLinkUserInfo(userId) {
      console.log(userId)
    },
    // 创建收藏夹
    handleCreateFavorite() {
      console.log(this.userFavoriteForm)
      createFavorite(this.userFavoriteForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogFormVisible = false
          this.userFavoriteForm = {}
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 监听收藏夹多选事件变化
    handleFavoriteCheckedChange(val) {
      this.favoriteBtn = false
    },
    // 仅仅收藏视频
    handleOnlyFavoriteVideo(videoId) {
      onlyFavoriteVideo(videoId).then(res => {
        if (res.code === 200) {
          // 收藏成功，将数组此视频的是否收藏改为已收藏
          this.$message.success("收藏成功")
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              if (!item.weatherFavorite) {
                item.favoritesNum += 1;
              }
              item.weatherFavorite = true;
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 收藏视频到收藏夹
    handleCollectVideo(videoId) {
      const dto = {
        "videoId": videoId,
        "favorites": this.favoriteChecked
      }
      favoriteVideoToCollection(dto).then(res => {
        if (res.code === 200 && res.data === true) {
          // 收藏成功
          this.$message.success("收藏成功")
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              if (!item.weatherFavorite) {
                item.favoritesNum += 1;
              }
              item.weatherFavorite = true;
            }
          })
        } else if (res.code === 200 && res.data === false) {
          // 从收藏夹移除
          this.$message.success("收藏成功")
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 取消收藏
    handleCancelFavoriteOver(videoId) {
      console.log("取消收藏=》" + videoId)
      userUnFavoriteVideo(videoId).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              if (item.weatherFavorite) {
                item.favoritesNum -= 1;
              }
              item.weatherFavorite = false;
            }
          })
          this.$refs[`favoritePop${videoId}`][0].showPopper = false
        }
      })
      // myFavoriteList().then(res => {
      //   if (res.code === 200) {
      //     this.userFavoriteList = res.data
      //   }
      // })
      // 鼠标悬停事件改为显示
      this.$refs[`favoritePop${videoId}`][0].showPopper = true
    },
    parseAddress(pos) {
      let add = pos.address.split(pos.province)[1]
      // 排除城市
      if (pos.city !== "") {
        add = add.split(pos.city)[1]
      }
      // 排除县
      if (pos.district !== "") {
        add = add.split(pos.district)[1]
      }
      // 排除街道
      if (pos.township !== "") {
        add = add.split(pos.township)[1]
      }
      return add
    },
    handlePlayVideo(videoId) {
      // console.log(videoId)
      this.activeVideoId = videoId
    },
    // emit视频播放事件
    emitVideoOnPlay(videoId) {
      const videos = document.getElementsByClassName("d-player-video-main");
      for (let i = 0; i < videos.length; i++) {
        // console.log(videos[i].id)
        if (this.activeVideoId !== videos[i].id) {
          videos[i].pause();
        }
      }

    }
  },
}
</script>

<style scoped>
.video-card {
  background-color: var(--el-bg-color-page);
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.23) 0 2px 3px 1px, rgba(0, 0, 0, 0.24) 2px 1px 2px 0;
  transition: all 0.3s ease;
  height: 65vh;
  margin-bottom: 1rem;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .12);
  }

}

.video-type-pics {
  position: absolute;
  left: 5%;
  top: 4%;
  padding: 5px 10px;
  background: var(--niuyin-bg-color2);
  backdrop-filter: blur(10px);
  border-radius: 6px;

  .type-desc {
    margin-left: 2px;
    color: gold;
  }
}

.video-container * {
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
      backdrop-filter: blur(40px);
      border-radius: 1rem;
    }

    .videoinfo-area {
      position: absolute;
      bottom: 10px;
      padding: 10px;
      width: 60%;
      left: 0;
      z-index: 1;
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
      bottom: 10px;
      padding-right: 16px;
      z-index: 1;
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

          .video-nums {
            align-items: center;
            color: #fff;
            display: flex;
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
  backdrop-filter: blur(10px);
  position: absolute !important;
}

:deep(.el-overlay) {
  position: absolute !important;
  background-color: transparent !important;
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

.video-type-pics {
  position: absolute;
  left: 2%;
  top: 2%;
  padding: 5px 10px;
  background: var(--niuyin-bg-color2);
  backdrop-filter: blur(10px);
  border-radius: 6px;

  .type-desc {
    margin-left: 2px;
    color: gold;
  }
}

.video-position {
  padding: 5px 10px;
  border-radius: 8px;
  background-color: rgba(118, 195, 118, 0.46);

  .position-city:after {
    border-left: 2px solid var(--niuyin-text-color);
    content: "";
    margin: 0 5px;
  }

  .position-dist:after {
    border-left: 2px solid var(--niuyin-text-color);
    content: "";
    margin: 0 5px;
  }

}

:deep(.el-carousel__container) {
  height: 100%;
}

/*移动端适配*/
@media (max-width: 500px) {
  .video-card {
    width: 49%;
    height: 160px;
  }
}

:deep(.d-player-wrap .d-player-control) {
  height: 10px !important;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  display: none !important;
}

</style>
