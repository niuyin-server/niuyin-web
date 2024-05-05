<template>
  <div class="user-video-dialog-body wh100">
    <!--      关闭按钮-->
    <div class="user-video-dialog-close flex-center" @click="handleUserVideoDialogClose">
      <svg class="icon1-5rem" aria-hidden="true">
        <use xlink:href="#icon-back"></use>
      </svg>
    </div>
    <!--      背景-->
    <div class="pa wh100" style="background-color: black">
      <img v-if="videoData.coverImage" class="video-cover wh100"
           style="filter: blur(40px);opacity: 0.8;user-select: none;" :src="videoData.coverImage" alt=""/>
    </div>
    <div class="user-video-box wh100" :style="{ backgroundImage: `url(${videoData.coverImage})` }">
      <div class="user-video-container h100 pr">
        <!--      展开按钮-->
        <div class="user-video-dialog-more-open flex-center"
             @click="handleUserVideoDialogMoreOpen(videoData.userId)">
          <svg class="icon1-5rem" aria-hidden="true">
            <use xlink:href="#icon-open"></use>
          </svg>
        </div>
        <!--            图文轮播-->
        <ImagePlayer v-if="videoData.publishType==='1'" :cover-image="videoData.coverImage"
                     :image-list="videoData.imageList"/>
        <!--            视频-->
        <VideoPlayer v-if="videoData.publishType==='0'"
                     class="videoPlayer wh100"
                     id="videoPlayer"
                     ref="videoPlayer"
                     :video-auto-play="true"
                     :video-muted="true"
                     :video-control="true"
                     :video="videoData"/>
        <!--          视频简介区域-->
        <div class="videoinfo-area">
          <!--              定位信息-->
          <div v-if="videoData.positionFlag==='1'">
            <div v-if="videoData.position!=null" class="video-position mtb5 flex-center">
              <svg class="icon mr5px" aria-hidden="true">
                <use xlink:href="#icon-position"></use>
              </svg>
              <span v-if="videoData.position.city" class="position-city fs9">{{ videoData.position.city }}</span>
              <span v-else class="position-city fs9">{{ videoData.position.province }}</span>
              <span class="position-dist fs9">{{ videoData.position.district }}</span>
              <span class="position-add fs9">{{ parseAddress(videoData.position) }}</span>
            </div>
          </div>
          <!--              视频信息-->
          <div class="video-title one-line cw fs125 fw600">
            <span>@ </span><span v-html="videoData.userNickName" class="cp"
                                 @click="handleLinkUserInfo(videoData.userId)"></span>
            <span class="fs9 fw400 cg"> · {{ smartDateFormat(videoData.createTime) }}</span>
          </div>
          <div v-html="videoData.videoTitle" class="video-title one-line cw fw400 mtb5"></div>
          <div>
                <span v-for="tag in videoData.tags" class="video-tag fs9 cp mr5px"
                      @click="handleClickVideoTag(tag)"><span>#</span>{{ tag }}</span>
          </div>
        </div>
        <!--          视频点赞等操作区域-->
        <div class="video-operate">
          <div class="operate-area">
            <div class="video-author">
              <el-avatar v-if="videoData.userAvatar"
                         class="user-avatar cp hv-scale"
                         :size="64"
                         :src="videoData.userAvatar"
                         lazy/>
              <el-avatar v-else
                         class="user-avatar cp"
                         :icon="UserFilled"/>
              <span v-if="!videoData.weatherFollow" class="user-att cp operate-icon">
                    <svg class="icon1-5rem" aria-hidden="true" @click="handleAttUser(videoData.userId)">
                      <use xlink:href="#icon-attention"></use></svg>
                  </span>
            </div>
            <!--            点赞  -->
            <div class="op">
              <svg v-if="videoData.weatherLike" class="icon32 operate-svg" aria-hidden="true"
                   @click="videoLikeClick(videoData.videoId)">
                <use xlink:href="#icon-like-ed"></use>
              </svg>
              <svg v-else class="icon32 operate-svg" aria-hidden="true" @click="videoLikeClick(videoData.videoId)">
                <use xlink:href="#icon-like"></use>
              </svg>
              <div style="text-align: center;color: white">{{ videoData.likeNum }}</div>
            </div>
            <!--              评论-->
            <div class="op">
              <svg class="icon32 operate-svg" aria-hidden="true" @click="videoCommentClick(videoData.videoId)">
                <use xlink:href="#icon-comment"></use>
              </svg>
              <div style="text-align: center;color: white">{{ videoData.commentNum }}</div>
            </div>
            <!--              收藏-->
            <div class="op">
              <!--收藏按钮弹框-->
              <el-popover placement="left-end"
                          :width="300"
                          :show-arrow="false"
                          :ref="'favoritePop'+videoData.videoId">
                <!--收藏按钮根据是否收藏显示不同的状态-->
                <template #reference>
                  <svg v-if="videoData.weatherFavorite" class="icon32 operate-svg" aria-hidden="true"
                       @click="handleCancelFavoriteOver(videoData.videoId)"
                       @mouseover.stop="handleFavoriteOver(videoData.videoId)">
                    <use xlink:href="#icon-favorite-ed"></use>
                  </svg>
                  <svg v-else class="icon32 operate-svg" aria-hidden="true"
                       @mouseover.stop="handleFavoriteOver(videoData.videoId)">
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
                          @click="handleOnlyFavoriteVideo(videoData.videoId)">仅收藏视频
                      </el-button>
                      <el-button type="primary"
                                 :disabled="favoriteBtn"
                                 @click="handleCollectVideo(videoData.videoId)">收藏至收藏夹
                      </el-button>
                    </div>
                  </div>
                </template>
              </el-popover>
              <div class="video-nums cw tac">{{ videoData.favoritesNum }}</div>
            </div>
            <!--              分享-->
            <div class="op">
              <svg class="icon32 operate-svg" aria-hidden="true">
                <use xlink:href="#icon-share"></use>
              </svg>
              <div class="video-nums cw tac">{{ videoData.favoritesNum }}</div>
            </div>
            <!--                更多-->
            <div class="op">
              <el-popover placement="left-end"
                          :width="300">
                <!--收藏按钮根据是否收藏显示不同的状态-->
                <template #reference>
                  <el-icon class="operate-icon"
                           :size="28"
                           color="white">
                    <MoreFilled/>
                  </el-icon>
                </template>
                <template #default>
                  <div class="p1rem">更多</div>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showUserVideoMore" class="user-video-slidebar h100">
        <div class="flex-between" style="height: 40px;">
          <el-tabs v-model="tabActiveId" @tab-click="handleTabUserVideoMoreClick">
            <el-tab-pane v-for="item in tabUserVideoMore"
                         :key="item.id"
                         :lazy="true"
                         :label="item.tabName"
                         :name="item.id">

            </el-tab-pane>
          </el-tabs>
          <div class="video-more-close cp flex-center" @click="handleCloseMorePostDialog">
            <Close style="width: 1rem; height: 1rem"/>
          </div>
        </div>
        <div v-if="tabActiveId===1" class="user-info-post">
          <!--                todo 查询用户详情，粉丝，总获赞-->
          <div class="user-info mb10px flex-between p1rem" style="border-bottom: 2px solid rgba(144,144,144,0.2)">
            <div class="user-info-left">
              <div class="user-info-name fw600 fs9 cp text-hv-primary mb5px">
                @<span @click="handleToUserProfile(videoData.userId)">{{ videoData.userNickName }}</span> >
              </div>
              <div class="flex-start">
                <div class="=user-info-fans flex-center">
                  <div class="mr-5r fs8">粉丝</div>
                  <div class="follow-right-8 fw600">{{ 10 }}</div>
                </div>
                <div class="user-info-like flex-center">
                  <div class="mr-5r fs8">获赞</div>
                  <div class="fw600">{{ 1 }}</div>
                </div>
              </div>
            </div>
            <div class="user-info-follow">
              <el-button v-if="videoData.weatherFollow" type="info" class="fs9">已关注</el-button>
              <el-button v-else type="primary" class="fs9">关注</el-button>
            </div>
          </div>
          <!--                作品区域-->
          <div class="user-post-area">
            <el-scrollbar v-infinite-scroll="loadMoreUserPost" style="padding: 0 .5rem;">
              <div class="user-post"
                   v-for="item in userPostList"
                   :key="item.videoId"
                   @click="handlePlayVideoPost(item)">
                <div class="post-card cp wh100 flex-center">
                  <!--                      封面-->
                  <img class="post-cover" :src="item.coverImage"/>
                  <!--                      获赞-->
                  <div class="post-like flex-center">
                    <svg class="icon1rem" aria-hidden="true">
                      <use xlink:href="#icon-like-num"></use>
                    </svg>
                    <span class="ml-5r">{{ item.likeNum }}</span>
                  </div>
                  <!--                      视频类型：图文-->
                  <div v-if="item.publishType===1" class="post-type flex-center">
                    <svg class="icon1rem" aria-hidden="true">
                      <use xlink:href="#icon-pics"></use>
                    </svg>
                    <span class="type-desc fs7 fw500 ml5px">图文</span>
                  </div>
                </div>
              </div>
              <div v-if="UserPostNotMore" class="w100">
                <el-divider>暂无更多数据</el-divider>
              </div>
              <el-backtop :right="16" :bottom="16" target=".el-dialog .el-scrollbar__wrap"
                          :visibility-height="10"/>
            </el-scrollbar>
          </div>

        </div>
        <div v-else-if="tabActiveId===2" class="user-info-post">
          <div class="pr wh100 ptb1rem">
            <VideoComment :video-id="videoData.videoId"
                          :show="true"
                          @emitUpdateVideoCommentNum="updateVideoCommentNumEmit"/>
          </div>
        </div>
        <div v-else-if="tabActiveId===3" class="user-info-post">
          相关推荐
        </div>
        <div v-else-if="tabActiveId===4" class="user-info-post">
          <video-note :video-id="videoData.videoId"/>
        </div>
      </div>
    </div>
  </div>
</template>

<!--
*@author roydon
*@date 2024/5/5 16:06
-->
<script>
import ImagePlayer from "@/components/video/ImagePlayer.vue";
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import {encodeData, smartDateFormat} from "@/utils/roydon.js";
import {CirclePlus, Close, MoreFilled, UserFilled} from "@element-plus/icons-vue";
import {favoriteVideoToCollection, myFavoriteList, onlyFavoriteVideo, videoInWhoseCollection} from "@/api/behave.js";
import {videoUserpage} from "@/api/video.js";
import VideoComment from "@/components/video/comment/VideoComment.vue";
import VideoNote from "@/components/video/note/VideoNote.vue";

export default {
  name: 'VideoPlayDialog',
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  props: {
    dialogVideo: Object,
  },
  components: {
    VideoNote,
    Close,
    MoreFilled,
    CirclePlus,
    VideoPlayer,
    ImagePlayer,
    VideoComment
  },
  data() {
    return {
      videoData: this.dialogVideo,
      videoId: '',
      dialogFormVisible: false,
      userFavoriteList: [],
      favoriteBtn: false,
      // 侧边栏用户作品区域开关
      showUserVideoMore: false,
      favoriteChecked: [],//已选收藏夹
      tabActiveId: 1,//热榜区域
      tabUserVideoMore: [
        {id: 1, tabName: "他的作品"},
        {id: 2, tabName: "评论"},
        // {id: 3, tabName: "相关推荐"},
        {id: 4, tabName: "视频笔记"},
      ],
      // 他的作品dto
      videoUserPageDTO: {
        userId: null,
        videoTitle: "",
        pageNum: 1,
        pageSize: 15
      },
      userPostList: [],
      userPostTotal: 0,
      UserPostNotMore: false,
      drawer: false,
      showVideoComment: false,
      commentInput: '',
      // 视频评论查询参数
      commentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        videoId: undefined,
      },
      commentTotal: 0,
      videoCommentTree: [],
    }
  },
  created() {
  },
  mounted() {
  },
  emits: ["dialogVisible"],
  methods: {
    smartDateFormat,
    // 关闭弹窗
    emitDialogVisible(flag) {
      this.$emit('dialogVisible', flag)
    },
    // 关闭用户视频弹窗
    handleUserVideoDialogClose() {
      this.userVideoDialogVisible = false
      this.showUserVideoMore = false
      this.videoUserPageDTO = {
        userId: null,
        videoTitle: "",
        pageNum: 1,
        pageSize: 15
      }
      this.userPostList = []
      this.userPostTotal = 0
      this.loadingMoreUserPost = false
      this.UserPostNotMore = false
      this.emitDialogVisible(false)
    },
    // 展开更多
    handleUserVideoDialogMoreOpen(userId) {
      this.showUserVideoMore = !this.showUserVideoMore
      // 获取他的作品
      this.videoUserPageDTO.userId = userId
      console.log(this.videoUserPageDTO)
      videoUserpage(this.videoUserPageDTO).then(res => {
        if (res.code === 200) {
          if (res.rows != null) {
            this.userPostList = res.rows
            this.userPostTotal = res.total
          }
          if (res.total < this.videoUserPageDTO.pageSize) {
            this.UserPostNotMore = true
          }
        }
      })
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
    // 跳转用户详情页面
    handleLinkUserInfo(userId) {
      console.log(userId)
    },
    // 点击视频标签跳转搜索
    handleClickVideoTag(tag) {
      this.$router.push(`/videoSearch?keyword=${tag}`);
    },
    // 关注用户
    handleAttUser(userId) {
      followUser(userId).then(res => {
        if (res.code === 200) {
          this.$message.success('关注成功')
          // 将数组此条数据改为已关注 weatherFollow = true
          this.videoList.forEach((item, index) => {
            if (item.userId === userId) {
              item.weatherFollow = true;
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 点赞视频
    videoLikeClick(videoId) {
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
      likeVideo(videoId).then(res => {
        if (res.code === 200) {

        } else {
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
    // 打开评论
    videoCommentClick(videoId) {
      this.videoId = videoId
      this.showUserVideoMore = true
      // this.showVideoComment = true
      this.tabActiveId = 2
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
    // 鼠标悬停显示
    handleFavoriteOver(videoId) {
      console.log("handleFavoriteShow" + videoId)
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
    handleTabUserVideoMoreClick() {
      console.log(this.tabActiveId)
    },
    // 关闭展开侧边栏
    handleCloseMorePostDialog() {
      this.showUserVideoMore = false
      this.videoUserPageDTO.pageNum = 1
      this.userPostList = []
      this.userPostTotal = 0
      this.loadingMoreUserPost = false
      this.UserPostNotMore = false
    },
    // 跳转到用户详情页面
    handleToUserProfile(userId) {
      const loginUser = userInfoX().userInfo
      if (userId === loginUser.userId) {
        this.$router.push({
          path: '/user'
        })
      } else {
        this.$router.push({
          path: '/person/' + encodeData(userId)
        })
      }
    },
    loadMoreUserPost() {
      if (this.UserPostNotMore) {
        return;
      }
      if (this.loadingMoreUserPost) {
        return
      }
      this.loadingMoreUserPost = true
      console.log("加载更多")
      this.videoUserPageDTO.pageNum += 1
      videoUserpage(this.videoUserPageDTO).then(res => {
        if (res.code === 200) {
          this.userPostList = this.userPostList.concat(res.rows)
          this.loadingMoreUserPost = false
          if (this.userPostList.length == res.total) {
            this.UserPostNotMore = true
          }
        }
      })
    },
    // 点击用户作品
    handlePlayVideoPost(video) {
      this.videoData = video
    },
    // 接收子组件增加视频评论传值
    updateVideoCommentNumEmit(videoId) {
      // 评论数+1
      this.videoData.commentNum += 1
    },
  }
}
</script>

<style scoped lang="scss">
$video-sidebar-width: 520px;

@media (max-width: 1500px) {
  $video-sidebar-width: 420px;
}

@media (max-width: 768px) {
  $video-sidebar-width: 320px;
}


/*用户视频弹窗*/
.user-video-dialog .el-dialog__header {
  display: none;
}

.user-video-dialog-body {
  position: relative;

  :deep(.el-carousel__container) {
    height: 100%;
  }

  /*关闭按钮*/

  .user-video-dialog-close {
    position: absolute;
    left: 2rem;
    top: 2rem;
    z-index: 2;
    cursor: pointer;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: rgba(10, 10, 10, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(10, 10, 10, 0.2);
    }
  }

  .user-video-box {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    transition: width .5s ease; /* 添加过渡效果 */
  }

  .user-video-container {
    flex-grow: 1; /* 占据剩余空间 */
    width: calc(100% - $video-sidebar-width);
    display: inline-block;
    transition: width .5s ease; /* 添加过渡效果 */
    /*展开按钮*/

    .user-video-dialog-more-open {
      position: absolute;
      right: 2rem;
      top: 2rem;
      z-index: 2;
      cursor: pointer;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-color: rgba(10, 10, 10, 0.2);
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(10, 10, 10, 0.3);
      }

    }

    .videoinfo-area {
      position: absolute;
      bottom: 50px;
      padding: 10px;
      width: 60%;
      left: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: self-start;
    }

    .video-operate {
      position: absolute;
      bottom: 50px;
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

          .iconfont {
            color: white;
          }

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

  .user-video-slidebar {
    width: 30%;
    padding: 0 1rem;
    z-index: 10;
    transition: width .5s ease; /* 添加过渡效果 */
    display: inline-block;
  }
}

:deep(.el-tabs__header) {
  background: transparent;
  margin-bottom: 0;
  border-bottom: 2px solid rgba(144, 144, 144, 0.2);
}

.user-post {
  width: 33.3333%;
  height: 200px;
  padding: 0 5px 10px;

  .post-card {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;

    .post-cover {
      transition: all .3s ease;
      transform: scale(1);
      height: 100%;
      width: 100%;
      -o-object-fit: cover;
      object-fit: cover;

      &:hover {
        transform: scale(1.1);
      }
    }

    .post-like {
      position: absolute;
      left: 10px;
      bottom: 5px;
    }

    .post-type {
      position: absolute;
      left: 10px;
      top: 5px;
      padding: 4px 8px;
      background: var(--niuyin-bg-color5);
      border-radius: 4px;
    }

  }
}

.user-info-post {
  display: flex;
  height: calc(100% - 40px);
  flex-direction: column;

  .user-post-area {
    height: 100%;
    margin: 0 -1rem;
    overflow: hidden;

    :deep(.el-scrollbar__view) {
      display: flex;
      flex-flow: row wrap;
    }
  }

}


.video-more-close {
  border-radius: 50%;
  padding: 5px;
  background-color: rgba(10, 10, 10, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(10, 10, 10, 0.2);
  }
}

/*操作栏：更多*/
.more-pop-icon {
  background-color: var(--niuyin-icon-bg0);
  padding: 1rem;
  border-radius: 50%
}

</style>
