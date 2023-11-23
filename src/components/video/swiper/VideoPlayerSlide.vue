<template>
  <div class="video-box">
    <div class="video-container" :style="{ backgroundImage: `url(${video.coverImage})` }">
      <!--            图文轮播-->
      <ImagePlayer v-if="video.publishType==='1'" :image-list="video.imageList"/>
      <!--            视频-->
      <VideoPlayer v-if="video.publishType==='0'"
                   class="videoPlayer"
                   id="videoPlayer"
                   :ref="'videoPlayer'+video.videoId"
                   :video="video"/>
      <!--            视频类型-->
      <div v-if="video.publishType==='1'" class="flex-center video-type-pics">
        <i class="iconfont icon-pics ml5 fs8"></i>
        <span class="type-desc fs7 fw500">图文</span>
      </div>
      <!--          视频简介区域-->
      <div class="videoinfo-area">
        <!--              定位信息-->
        <div v-if="video.positionFlag==='1'" class="video-position mtb5 flex-center">
          <i class="iconfont icon-position fs125 mr5px"></i>
          <span v-if="video.position.city" class="position-city fs9">{{ video.position.city }}</span>
          <span v-else class="position-city fs9">{{ video.position.province }}</span>
          <span class="position-dist fs9">{{ video.position.district }}</span>
          <span class="position-add fs9">{{ parseAddress(video.position) }}</span>
        </div>
        <!--              视频信息-->
        <div class="video-title one-line cw fs125 fw600">
          <span>@ </span><span v-html="video.userNickName" class="cp"
                               @click="handleLinkUserInfo(video.userId)"></span>
          <span class="fs9 fw400 cg"> · {{ smartDateFormat(video.createTime) }}</span>
        </div>
        <div v-html="video.videoTitle" class="video-title one-line cw fw400 mtb5"></div>
        <div>
          <span v-for="tag in video.tags" class="video-tag fs8 cp">{{ ' #' + tag }}</span>
        </div>
      </div>
      <!--          视频点赞等操作区域-->
      <div class="video-operate">
        <div class="operate-area">
          <div class="video-author">
            <el-avatar v-if="video.userAvatar"
                       class="user-avatar cp"
                       :size="64"
                       :src="video.userAvatar"
                       lazy/>
            <el-avatar v-else
                       class="user-avatar cp"
                       :icon="UserFilled"/>
            <span v-if="!video.weatherFollow" class="user-att cp operate-icon">
                  <i class="iconfont icon-attention fs24px" @click="handleAttUser(video.userId)"/>
                  </span>
          </div>
          <!--            点赞  -->
          <div class="op">
            <i v-if="video.weatherLike" class="iconfont icon-like-ed icon-36 operate-icon"
               @click="videoLikeClick(video.videoId)"></i>
            <i v-else class="iconfont icon-like icon-36 operate-icon"
               @click="videoLikeClick(video.videoId)"></i>
            <div style="text-align: center;color: white">{{ video.likeNum }}</div>
          </div>
          <!--              评论-->
          <div class="op">
            <i class="iconfont icon-comment icon-36 operate-icon"
               @click="videoCommentClick(video.videoId)"></i>
            <div style="text-align: center;color: white">{{ video.commentNum }}</div>
          </div>
          <!--              收藏-->
          <div class="op">
            <!--收藏按钮弹框-->
            <el-popover placement="left"
                        :width="300"
                        :ref="'favoritePop'+video.videoId">
              <!--收藏按钮根据是否收藏显示不同的状态-->
              <template #reference>
                <i v-if="video.weatherFavorite" class="iconfont icon-favorite-ed icon-36 operate-icon"
                   @click="handleCancelFavoriteOver(video.videoId)"
                   @mouseover.stop="handleFavoriteOver(video.videoId)"></i>
                <i v-else class="iconfont icon-favorite icon-36 operate-icon"
                   @mouseover.stop="handleFavoriteOver(video.videoId)"
                   @mouseleave.stop="handleFavoriteLeave(video.videoId)"></i>
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
                                   v-for="video2 in userFavoriteList"
                                   border
                                   :key="video2.favoriteId"
                                   :label="video2.favoriteId"
                                   :name="video2.title">{{ video2.title }}
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
            <i class="iconfont icon-share icon-36 operate-icon"></i>
            <div class="video-nums cw tac">{{ video.favoritesNum }}</div>
          </div>
          <!--                更多-->
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
  </div>
  <!--新建收藏夹提示框-->
  <el-dialog
      v-model="dialogFormVisible"
      title="新建收藏夹"
      width="400px"
      align-center>
    <!--收藏夹名称输入框-->
    <div>
      <div class="mb5">图标</div>
      <i class="iconfont icon-camera mtlrb5"></i>
      <i class="iconfont icon-history mtlrb5"></i>
      <i class="iconfont icon-attention mtlrb5"></i>
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
<script >

import VideoPlayer from "@/components/video/VideoPlayer.vue";
import ImagePlayer from "@/components/video/ImagePlayer.vue";
import VideoComment from "@/components/video/comment/VideoComment.vue";
import {Swiper, SwiperSlide} from "swiper/vue";
import {
  ArrowDownBold,
  ArrowUpBold,
  ChatDotRound, ChromeFilled,
  CirclePlus, Close,
  MoreFilled,
  QuestionFilled,
  UserFilled
} from "@element-plus/icons-vue";
import {A11y, Autoplay, Mousewheel, Navigation, Pagination} from "swiper";
import {
  createFavorite,
  favoriteVideoToCollection,
  likeVideo,
  myFavoriteList,
  onlyFavoriteVideo,
  videoInWhoseCollection
} from "@/api/behave.js";
import {followUser} from "@/api/social.js";

export default {
  name:"VideoPlayerSlide",
  components: {
    VideoComment,
    Swiper,
    SwiperSlide,
    ImagePlayer,
    CirclePlus, QuestionFilled, ArrowDownBold, ArrowUpBold, MoreFilled, VideoPlayer,
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
      videoSwiper: {},
      modules: [Autoplay, Pagination, Navigation, A11y, Mousewheel],
      realIndex: 0,
      loadMore: false,
      dialogFormVisible: false,
      favoriteBtn: false,
      publishTime: null,
      userFavoriteForm: {
        title: "",
        description: "",
        coverImage: "",
        showStatus: "0"
      },
      userFavoriteList: '',
      userFavoriteTotal: undefined,
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
      waitLoadData: false, //待加载数据
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
      this.$refs[`favoritePop${videoId}`][0].showPopper = true
    },
    // 鼠标离开后显示事件改为不显示
    handleFavoriteLeave(videoId) {
      this.$refs[`favoritePop${videoId}`][0].showPopper = false
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
    // 打开评论抽屉
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
        console.log("方向键--上")
        const _that = this;
        this.drawer = false
        this.showVideoComment = false
        if (!_that.timeOut) {
          _that.timeOut = setTimeout(() => {
            _that.timeOut = null;
            _that.videoSwiper.slidePrev()
          }, 1000);
        }
      }
      if (e.keyCode === 40) {
        console.log("方向键--下")
        const _that = this;
        this.drawer = false
        this.showVideoComment = false
        if (!_that.timeOut) {
          _that.timeOut = setTimeout(() => {
            _that.timeOut = null;
            _that.videoSwiper.slideNext()
          }, 1000);
        }
      }
      if (e.keyCode === 37) {
        console.log("方向键--左")
      }
      if (e.keyCode === 39) {
        console.log("方向键--右")
      }
    },
    // 跳转用户详情页面
    handleLinkUserInfo(userId) {
      console.log(userId)
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
    keyDownZ(videoId, e) {
      // 点赞
      if (e.keyCode === 90) {
        console.log(videoId)
        if (!this.isLiked) {
          this.videoLikeClick(videoId)
          this.isLiked = true
        }
      }
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
      myFavoriteList().then(res => {
        if (res.code === 200) {
          this.userFavoriteList = res.data
        }
      })
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
  },
}
</script>
<style scoped>
@import "@/assets/styles/components/video-player-swiper.scss";
</style>
