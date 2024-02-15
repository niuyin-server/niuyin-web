<template>
  <div class="wh100 pr flex-between"
       v-loading="loading"
       :element-loading-svg="svg"
       element-loading-svg-view-box="-10, -10, 50, 50">
    <el-carousel class="video-player"
                 ref="carousel"
                 :element-loading-spinner="true"
                 direction="vertical"
                 :autoplay="false"
                 :loop="false"
                 :lazy="true"
                 indicator-position="none"
                 @keydown.stop="keyDown"
                 @mousewheel="rollScroll($event)"
                 @change="carouselChange"
                 @ended="carouselEnd">
      <el-carousel-item v-for="item in videoList"
                        :key="item.videoId"
                        :lazy="true"
                        @keydown="keyDownZ(item.videoId,$event)">
        <div class="video-box">
          <div class="video-container">
            <!--            图文轮播-->
            <ImagePlayer v-if="item.publishType==='1'" :cover-image="item.coverImage" :image-list="item.imageList"/>
            <!--            视频-->
            <VideoPlayer v-if="item.publishType==='0'"
                         class="videoPlayer"
                         id="videoPlayer"
                         :video="item"/>
            <!--            视频类型-->
            <div v-if="item.publishType==='1'" class="flex-center video-type-pics">
              <svg class="icon1rem" aria-hidden="true">
                <use xlink:href="#icon-pics"></use>
              </svg>
              <span class="type-desc fs7 fw500">图文</span>
            </div>
            <!--          视频简介区域-->
            <div class="videoinfo-area">
              <!--              定位信息-->
              <div v-if="item.positionFlag==='1'" class="video-position mtb5 flex-center">
                <svg class="icon mr5px" aria-hidden="true">
                  <use xlink:href="#icon-position"></use>
                </svg>
                <span v-if="item.position.city" class="position-city fs9">{{ item.position.city }}</span>
                <span v-else class="position-city fs9">{{ item.position.province }}</span>
                <span class="position-dist fs9">{{ item.position.district }}</span>
                <span class="position-add fs9">{{ parseAddress(item.position) }}</span>
              </div>
              <!--              视频信息-->
              <div class="video-title one-line cw fs125 fw600">
                <span>@ </span><span v-html="item.userNickName" class="cp"
                                     @click="handleLinkUserInfo(item.userId)"></span>
                <span class="fs9 fw400 cg"> · {{ smartDateFormat(item.createTime) }}</span>
              </div>
              <div v-html="item.videoTitle" class="video-title one-line cw fw400 mtb5"></div>
              <div>
                <span v-for="tag in item.tags" class="video-tag fs9 cp mr5px"
                      @click="handleClickVideoTag(tag)"><span>#</span>{{ tag }}</span>
              </div>
            </div>
            <!--          视频点赞等操作区域-->
            <div class="video-operate">
              <div class="operate-area">
                <div class="video-author" @click="handlePersonInfo(item.userId,item)">
                  <el-avatar v-if="item.userAvatar"
                             class="user-avatar cp hv-scale"
                             :size="64"
                             :src="item.userAvatar"
                             lazy/>
                  <el-avatar v-else
                             class="user-avatar cp"
                             :icon="UserFilled"/>
                  <span v-if="!item.weatherFollow" class="user-att cp operate-icon">
                    <svg class="icon1-5rem" aria-hidden="true" @click="handleAttUser(item.userId)">
                      <use xlink:href="#icon-attention"></use></svg>
                  </span>
                </div>
                <!--            点赞  -->
                <div class="op">
                  <svg v-if="item.weatherLike" class="icon32 operate-svg" aria-hidden="true"
                       @click="videoLikeClick(item.videoId)">
                    <use xlink:href="#icon-like-ed"></use>
                  </svg>
                  <svg v-else class="icon32 operate-svg" aria-hidden="true" @click="videoLikeClick(item.videoId)">
                    <use xlink:href="#icon-like"></use>
                  </svg>
                  <div style="text-align: center;color: white">{{ item.likeNum }}</div>
                </div>
                <!--              评论-->
                <div class="op">
                  <svg class="icon32 operate-svg" aria-hidden="true" @click="videoCommentClick(item.videoId)">
                    <use xlink:href="#icon-comment"></use>
                  </svg>
                  <div style="text-align: center;color: white">{{ item.commentNum }}</div>
                </div>
                <!--              收藏-->
                <div class="op">
                  <!--收藏按钮弹框-->
                  <el-popover placement="left-end"
                              :width="300"
                              :ref="'favoritePop'+item.videoId">
                    <!--收藏按钮根据是否收藏显示不同的状态-->
                    <template #reference>
                      <svg v-if="item.weatherFavorite" class="icon32 operate-svg" aria-hidden="true"
                           @click="handleCancelFavoriteOver(item.videoId)"
                           @mouseover.stop="handleFavoriteOver(item.videoId)">
                        <use xlink:href="#icon-favorite-ed"></use>
                      </svg>
                      <svg v-else class="icon32 operate-svg" aria-hidden="true"
                           @mouseover.stop="handleFavoriteOver(item.videoId)"
                           @mouseleave.stop="handleFavoriteLeave(item.videoId)">
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
                              @click="handleOnlyFavoriteVideo(item.videoId)">仅收藏视频
                          </el-button>
                          <el-button type="primary"
                                     :disabled="favoriteBtn"
                                     @click="handleCollectVideo(item.videoId)">收藏至收藏夹
                          </el-button>
                        </div>
                      </div>
                    </template>
                  </el-popover>
                  <div class="video-nums cw tac">{{ item.favoritesNum }}</div>
                </div>
                <!--              分享-->
                <div class="op">
                  <svg class="icon32 operate-svg" aria-hidden="true">
                    <use xlink:href="#icon-share"></use>
                  </svg>
                  <div class="video-nums cw tac">{{ item.favoritesNum }}</div>
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
        </div>
        <!-- 视频评论抽屉 -->
        <el-drawer class="video-sidebar"
                   v-model="drawer"
                   v-if="showVideoComment"
                   :show-close="false"
                   @mousewheel.stop
                   :before-close="videoCommentTree=null">
          <template #header="{ close, titleId, titleClass }">
            <h2 class="cw" :id="titleId" :class="titleClass">评论 <span>( {{ item.commentNum }} )</span></h2>
            <!--            <h2 class="cw" :id="titleId" :class="titleClass">评论</h2>-->
            <el-button circle class="cb" :icon="Close" type="info" @click="close">
            </el-button>
          </template>
          <VideoComment :video-id="videoId"
                        :show="true"
                        @emitUpdateVideoCommentNum="updateVideoCommentNumEmit"/>
        </el-drawer>
      </el-carousel-item>
    </el-carousel>
    <!-- 视频右侧控制按钮-->
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
    <!-- 反馈-->
    <div class="feedback">
      <div class="feedback-icon flex-center cp">
        <el-icon color="#5a5a5a" :size="20">
          <QuestionFilled/>
        </el-icon>
      </div>
    </div>
  </div>
  <!-- 新建收藏夹提示框 -->
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
  <!-- 用户视频详情弹窗 -->
  <el-dialog
      v-model="userVideoDialogVisible"
      modal="false"
      custom-class="user-video-dialog"
      fullscreen
      destroy-on-close="true"
      align-center>
    <div class="user-video-dialog-body wh100">
      <!--      关闭按钮-->
      <div class="user-video-dialog-close flex-center" @click="handleUserVideoDialogClose">
        <svg class="icon1-5rem" aria-hidden="true">
          <use xlink:href="#icon-back"></use>
        </svg>
      </div>
      <!--      背景-->
      <div class="pa wh100" style="background-color: black">
        <img v-if="dialogVideo.coverImage" class="video-cover wh100"
             style="filter: blur(60px);opacity: 0.8;user-select: none;" :src="dialogVideo.coverImage" alt=""/>
      </div>
      <div class="user-video-box wh100" :style="{ backgroundImage: `url(${dialogVideo.coverImage})` }">
        <div class="user-video-container h100 pr">
          <!--      展开按钮-->
          <div class="user-video-dialog-more-open flex-center"
               @click="handleUserVideoDialogMoreOpen(dialogVideo.userId)">
            <svg class="icon1-5rem" aria-hidden="true">
              <use xlink:href="#icon-open"></use>
            </svg>
          </div>
          <!--            图文轮播-->
          <ImagePlayer v-if="dialogVideo.publishType==='1'" :cover-image="dialogVideo.coverImage"
                       :image-list="dialogVideo.imageList"/>
          <!--            视频-->
          <VideoPlayer v-if="dialogVideo.publishType==='0'"
                       class="videoPlayer wh100"
                       id="videoPlayer"
                       ref="videoPlayer"
                       :video="dialogVideo"/>
          <!--            视频类型-->
          <div v-if="dialogVideo.publishType==='1'" class="flex-center video-type-pics">
            <svg class="icon1rem" aria-hidden="true">
              <use xlink:href="#icon-pics"></use>
            </svg>
            <span class="type-desc fs7 fw500">图文</span>
          </div>
          <!--          视频简介区域-->
          <div class="videoinfo-area">
            <!--              定位信息-->
            <div v-if="dialogVideo.positionFlag==='1'&& dialogVideo.position" class="video-position mtb5 flex-center">
              <svg class="icon mr5px" aria-hidden="true">
                <use xlink:href="#icon-position"></use>
              </svg>
              <span v-if="dialogVideo.position.city" class="position-city fs9">{{ dialogVideo.position.city }}</span>
              <span v-else class="position-city fs9">{{ dialogVideo.position.province }}</span>
              <span class="position-dist fs9">{{ dialogVideo.position.district }}</span>
              <span class="position-add fs9">{{ parseAddress(dialogVideo.position) }}</span>
            </div>
            <!--              视频信息-->
            <div class="video-title one-line cw fs125 fw600">
              <span>@ </span><span v-html="dialogVideo.userNickName" class="cp"
                                   @click="handleLinkUserInfo(dialogVideo.userId)"></span>
              <span class="fs9 fw400 cg"> · {{ smartDateFormat(dialogVideo.createTime) }}</span>
            </div>
            <div v-html="dialogVideo.videoTitle" class="video-title one-line cw fw400 mtb5"></div>
            <div>
                <span v-for="tag in dialogVideo.tags" class="video-tag fs9 cp mr5px"
                      @click="handleClickVideoTag(tag)"><span>#</span>{{ tag }}</span>
            </div>
          </div>
          <!--          视频点赞等操作区域-->
          <div class="video-operate">
            <div class="operate-area">
              <div class="video-author">
                <el-avatar v-if="dialogVideo.userAvatar"
                           class="user-avatar cp hv-scale"
                           :size="64"
                           :src="dialogVideo.userAvatar"
                           lazy/>
                <el-avatar v-else
                           class="user-avatar cp"
                           :icon="UserFilled"/>
                <span v-if="!dialogVideo.weatherFollow" class="user-att cp operate-icon">
                    <svg class="icon1-5rem" aria-hidden="true" @click="handleAttUser(dialogVideo.userId)">
                      <use xlink:href="#icon-attention"></use></svg>
                  </span>
              </div>
              <!--            点赞  -->
              <div class="op">
                <svg v-if="dialogVideo.weatherLike" class="icon32 operate-svg" aria-hidden="true"
                     @click="videoLikeClick(dialogVideo.videoId)">
                  <use xlink:href="#icon-like-ed"></use>
                </svg>
                <svg v-else class="icon32 operate-svg" aria-hidden="true" @click="videoLikeClick(dialogVideo.videoId)">
                  <use xlink:href="#icon-like"></use>
                </svg>
                <div style="text-align: center;color: white">{{ dialogVideo.likeNum }}</div>
              </div>
              <!--              评论-->
              <div class="op">
                <svg class="icon32 operate-svg" aria-hidden="true" @click="videoCommentClick(dialogVideo.videoId)">
                  <use xlink:href="#icon-comment"></use>
                </svg>
                <div style="text-align: center;color: white">{{ dialogVideo.commentNum }}</div>
              </div>
              <!--              收藏-->
              <div class="op">
                <!--收藏按钮弹框-->
                <el-popover placement="left-end"
                            :width="300"
                            :ref="'favoritePop'+dialogVideo.videoId">
                  <!--收藏按钮根据是否收藏显示不同的状态-->
                  <template #reference>
                    <svg v-if="dialogVideo.weatherFavorite" class="icon32 operate-svg" aria-hidden="true"
                         @click="handleCancelFavoriteOver(dialogVideo.videoId)"
                         @mouseover.stop="handleFavoriteOver(dialogVideo.videoId)">
                      <use xlink:href="#icon-favorite-ed"></use>
                    </svg>
                    <svg v-else class="icon32 operate-svg" aria-hidden="true">
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
                            @click="handleOnlyFavoriteVideo(dialogVideo.videoId)">仅收藏视频
                        </el-button>
                        <el-button type="primary"
                                   :disabled="favoriteBtn"
                                   @click="handleCollectVideo(dialogVideo.videoId)">收藏至收藏夹
                        </el-button>
                      </div>
                    </div>
                  </template>
                </el-popover>
                <div class="video-nums cw tac">{{ dialogVideo.favoritesNum }}</div>
              </div>
              <!--              分享-->
              <div class="op">
                <svg class="icon32 operate-svg" aria-hidden="true">
                  <use xlink:href="#icon-share"></use>
                </svg>
                <div class="video-nums cw tac">{{ dialogVideo.favoritesNum }}</div>
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
            <div class="video-more-close cp flex-center" @click="showUserVideoMore = false">
              <Close style="width: 1rem; height: 1rem"/>
            </div>
          </div>
          <div v-if="tabActiveId===1" class="user-info-post">
            <!--                todo 查询用户详情，粉丝，总获赞-->
            <div class="user-info mb10px flex-between p1rem" style="border-bottom: 2px solid rgba(144,144,144,0.2)">
              <div class="user-info-left">
                <div class="user-info-name fw600 fs9 cp text-hv-primary mb5px">
                  @<span @click="handleToUserProfile(dialogVideo.userId)">{{ dialogVideo.userNickName }}</span> >
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
                <el-button v-if="dialogVideo.weatherFollow" type="info" class="fs9">已关注</el-button>
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
            <div v-if="tabActiveId===2">
              评论
            </div>
            <div v-if="tabActiveId===3">
              相关推荐
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  ArrowDownBold,
  ArrowUpBold,
  ChatDotRound, ChromeFilled, CirclePlus, Close, MoreFilled, QuestionFilled, UserFilled
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
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import VideoComment from "@/components/video/comment/VideoComment.vue";
import ImagePlayer from "@/components/video/ImagePlayer.vue";
import {userInfoX} from "@/store/userInfoX";
import {encodeData, smartDateFormat} from "@/utils/roydon.js";
import UserVideoDialog from "@/components/video/UserVideoDialog.vue";
import {videoUserpage} from "@/api/video.js";

export default {
  name: 'VideoPlayerCarousel',
  components: {
    Close,
    ImagePlayer,
    UserVideoDialog,
    CirclePlus,
    QuestionFilled,
    ArrowDownBold,
    ArrowUpBold,
    MoreFilled,
    VideoPlayer,
    VideoComment
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
    videoList: Array,
    loading: Boolean
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
      userVideoDialogVisible: false,// 点击用户头像跳转详情页面弹窗
      dialogVideo: null,
      showUserVideoMore: false,
      tabActiveId: 1,//热榜区域
      tabUserVideoMore: [
        {id: 1, tabName: "他的作品"},
        {id: 2, tabName: "评论"},
        {id: 3, tabName: "相关推荐"}
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
      loadingMoreUserPost: false,
      UserPostNotMore: false,
    }
  },
  emits: ['reloadVideoFeed'],
  mounted() {
  },
  watch: {
    dialogVideo(newVideo) {
      // 监听 dialogVideo 的变化

      // this.$refs.videoPlayer.loadVideo(newVideo); // 调用 VideoPlayer 组件的方法重新加载视频
    }
  },
  methods: {
    smartDateFormat,
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
        console.log("方向键--左")
      }
      if (e.keyCode === 39) {
        console.log("方向键--右")
      }
    },
    // 切换视频暂停视频
    carouselChange(newVal, oldVal) {
      console.log("newVal=>" + newVal + "、oldVal=>" + oldVal + "、videoLength=>" + this.videoList.length)
      const videos = document.getElementsByClassName("d-player-video-main");
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
        }, 100);
      }
      if (newVal === this.videoList.length - 1) {
        this.waitLoadMore = true
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
        }, 500);
      } else {
      }
      if (this.waitLoadMore) {
        this.$emit("reloadVideoFeed", true)
        this.waitLoadMore = false
      }
    },
    // playswitch 上一个
    handleVideoPrev() {
      if (!this.timeOut) {
        this.timeOut = setTimeout(() => {
          this.timeOut = null;
          this.$refs.carousel.prev()
        }, 500);
      }
    },
    // playswitch 下一个
    handleVideoNext() {
      console.log("next")
      const _that = this;
      this.drawer = false
      this.showVideoComment = false
      if (!_that.timeOut) {
        _that.timeOut = setTimeout(() => {
          _that.timeOut = null;
          _that.$refs.carousel.next()
        }, 500);
      }
      if (this.waitLoadMore) {
        this.$emit("reloadVideoFeed", true)
        this.waitLoadMore = false
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
    // 点击视频标签跳转搜索
    handleClickVideoTag(tag) {
      this.$router.push(`/videoSearch?keyword=${tag}`);
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
    // 打开弹框
    handlePersonInfo(userId, video) {

      // 暂停所以视频
      const videos = document.getElementsByClassName("d-player-video-main");
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
        }, 2);
      }
      // console.log(userId)
      //
      //
      // console.log(video)
      this.dialogVideo = video
      this.userVideoDialogVisible = true
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
    },
    // 展开更多
    handleUserVideoDialogMoreOpen(userId) {
      this.showUserVideoMore = !this.showUserVideoMore
      // 获取他的作品
      this.videoUserPageDTO.userId = userId
      videoUserpage(this.videoUserPageDTO).then(res => {
        if (res.code === 200) {
          this.userPostList = res.rows
          this.userPostTotal = res.total
          if (res.total < this.videoUserPageDTO.pageSize) {
            this.UserPostNotMore = true
          }
        }
      })
    },
    handleTabUserVideoMoreClick() {
      console.log(this.tabActiveId)
    },
    // 点击用户作品
    handlePlayVideoPost(video) {
      this.dialogVideo = video
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
  },
}
</script>
<style scoped lang="scss">
.video-player {
  width: 95%;
  border-radius: 1rem;
  height: 100%;
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
      border-radius: 1rem;
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

      .video-title {
        max-width: 95%;
      }
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
    background-color: var(--niuyin-custom-bg);
    border-radius: 1.5rem;
    padding: 1px;

    &:hover {
      backdrop-filter: blur(5px);
    }

    .player-playswitch-prev {
      padding: 10px;
      transition: all 0.5s ease;

      &:hover .el-icon {
        --color: var(--niuyin-primary-color) !important;
      }
    }

    .player-playswitch-next {
      padding: 10px;
      transition: all 0.5s ease;

      &:hover .el-icon {
        --color: var(--niuyin-primary-color) !important;
      }
    }
  }
}

.feedback {
  position: fixed;
  bottom: 1rem;
  right: 6px;

  .feedback-icon {
    padding: 10px;
    background-color: var(--niuyin-custom-bg);
    vertical-align: middle;
    border-radius: 2rem;
  }
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
    z-index: 11;
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
      z-index: 11;
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
</style>

