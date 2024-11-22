<template>
  <div class="hot-container wh100">
    <el-scrollbar>
      <el-empty v-show="hotVideoTotal<=0" description="暂无数据"/>
      <el-skeleton class="w100" :loading="loading" animated>
        <template #template>
          <div class="loading-container" v-for="i in 2">
            <div class="loading-item" v-for="i in 5">
              <el-skeleton-item variant="image" style="width: 100%; height: 300px"/>
              <div class="p1rem">
                <el-skeleton-item variant="h1" style="width: 80%"/>
                <div>
                  <el-skeleton-item variant="text"/>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <div class="hotVideo-list w100" style="height: auto">
            <div class="hotVideos"
                 v-masonry
                 fit-width="true"
                 transition-duration="0.2s"
                 item-selector=".hotVideo-item">
              <!--              热榜-->
              <div style="height: 600px;" class="hotVideo-item">
                <div class="hotVideo-card wh100">
                  <el-tabs v-model="activeName" @tab-click="handleHotTabClick" class="wh100">
                    <el-tab-pane v-for="item in hotTabShow"
                                 :key="item.id"
                                 :label="item.tabName"
                                 :lazy="true"
                                 :name="item.tabName">
                      <el-scrollbar>
                        <div class="hot-search-list w100" style="height: auto">
                          <div v-for="(it,index) in item.dataList" class="p5px">
                            <div class="text-hv-primary cp hot-hover-item">
                              <p class="one-line">
                                <span class="mr5px">{{ index + 1 }}、</span>
                                <span class="" @click="handleClickHotTable(it)"> {{ it }}</span>
                              </p></div>
                          </div>
                        </div>
                      </el-scrollbar>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
              <!--              热门视频-->
              <div v-for='(item,index) in hotVideoList'
                   :key="item.videoId"
                   v-masonry-tile
                   class="hotVideo-item cp">
                <VideoHotCard :video="item"/>
                <!--                <el-card class="hotVideo-card">-->
                <!--                  <div class="video-cover tac">-->
                <!--                    <el-image class="eli-ofc wh100"-->
                <!--                              @click="videoDialog(item.videoId)"-->
                <!--                              :src="item.coverImage"/>-->
                <!--                  </div>-->
                <!--                  <div class="user-info" @click="handleVideoPlayDialog(item)">-->
                <!--                    <div>-->
                <!--                      <p class="one-line fs9">{{ item.videoTitle }}</p>-->
                <!--                      <p class="one-line fs7 cg">{{ item.videoDesc }}</p>-->
                <!--                    </div>-->
                <!--                    &lt;!&ndash;鼠标悬停在视频发布者头像上时展示该视频发布者的信息&ndash;&gt;-->
                <!--                    <el-popover :width="300"-->
                <!--                                placement="top"-->
                <!--                                popper-class="person-info-pop"-->
                <!--                                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"-->
                <!--                                :ref="'pop'+index">-->
                <!--                      &lt;!&ndash;视频发布者的头像&ndash;&gt;-->
                <!--                      <template #reference>-->
                <!--                        <div>-->
                <!--                          <el-avatar v-if="item.userAvatar"-->
                <!--                                     class="cp"-->
                <!--                                     :lazy="true"-->
                <!--                                     :src="item.userAvatar"-->
                <!--                                     @click.stop="handlePersonInfo(item.userId)"-->
                <!--                                     @mouseover="handleSocialBehaveNumsHover(item.userId,index)"-->
                <!--                                     @mouseleave="handleSocialBehaveNumsHoverLeave(item.userId,index)"/>-->
                <!--                          <el-avatar v-else class="cp"-->
                <!--                                     :icon="UserFilled"-->
                <!--                                     @click="handlePersonInfo(item.userId)"/>-->
                <!--                        </div>-->
                <!--                      </template>-->
                <!--                      <template #default>-->
                <!--                        &lt;!&ndash;视频发布者的头像、名称和关注粉丝等信息展示模块&ndash;&gt;-->
                <!--                        <div class="flex-column">-->
                <!--                          &lt;!&ndash;视频发布者的头像div&ndash;&gt;-->
                <!--                          <div style="display: flex;">-->
                <!--                            <div>-->
                <!--                              <el-avatar v-if="item.userAvatar" class="cp" :src="item.userAvatar"/>-->
                <!--                              <el-avatar v-else class="cp" :icon="UserFilled"/>-->
                <!--                            </div>-->
                <!--                            &lt;!&ndash;名称和关注粉丝等信息展示模块&ndash;&gt;-->
                <!--                            <div style="display: grid; margin-left: 10px;">-->
                <!--                              &lt;!&ndash;名称展示模块&ndash;&gt;-->
                <!--                              <div v-html="item.userNickName" class="fs9 fw600 cp"></div>-->
                <!--                              &lt;!&ndash;点赞、关注、粉丝等信息展示模块&ndash;&gt;-->
                <!--                              <div class="flex-between">-->
                <!--                                &lt;!&ndash;关注信息展示模块&ndash;&gt;-->
                <!--                                <p class="">{{ userVideoLikes }}</p><span>关注</span>-->
                <!--                                &lt;!&ndash;粉丝信息展示模块&ndash;&gt;-->
                <!--                                <p class="ml-5r">{{ followedNums }}<span>粉丝</span></p>-->
                <!--                                &lt;!&ndash;获赞信息展示模块&ndash;&gt;-->
                <!--                                <p class="ml-5r">{{ fanNums }}</p><span>获赞</span>-->
                <!--                              </div>-->
                <!--                              &lt;!&ndash;关注以及私信功能模块展示&ndash;&gt;-->
                <!--                              <div style="display: flex; margin-top: 10px;">-->
                <!--                                <div v-if="item.weatherFollow">-->
                <!--                                  <el-button type="info">已关注</el-button>-->
                <!--                                </div>-->
                <!--                                <div v-else>-->
                <!--                                  <el-button type="primary">+关注</el-button>-->
                <!--                                </div>-->
                <!--                              </div>-->
                <!--                            </div>-->
                <!--                          </div>-->
                <!--                        </div>-->
                <!--                      </template>-->
                <!--                    </el-popover>-->
                <!--                  </div>-->
                <!--                </el-card>-->
              </div>
            </div>
            <Loading v-if="loadingIcon" :is-full-screen="false"/>
          </div>
        </template>
      </el-skeleton>
      <div v-if="dataNotMore">
        <el-divider>暂无更多数据</el-divider>
      </div>
      <!--      <el-dialog v-model="dialogVisible"-->
      <!--                 @close="dialogDestroy"-->
      <!--                 width="80%"-->
      <!--                 :show-close="false">-->
      <!--        <template #header="{ close, titleId, titleClass }">-->
      <!--          <h3 class="one-line" :id="titleId" :class="titleClass">{{ video.videoTitle }}</h3>-->
      <!--          <el-button circle :icon="Close" type="info" @click="close">-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--        <video class="dialog-video"-->
      <!--               style="width: 100%;max-height: 100vh;height: 60vh; border-radius: 1rem"-->
      <!--               autoplay-->
      <!--               :src="video.videoUrl"-->
      <!--               controls/>-->
      <!--      </el-dialog>-->
    </el-scrollbar>
    <el-backtop :right="16" :bottom="16" target=".main-container  .el-scrollbar__wrap"></el-backtop>
  </div>
  <!--  <el-dialog-->
  <!--      v-model="userVideoDialogVisible"-->
  <!--      :modal="false"-->
  <!--      custom-class="user-video-dialog"-->
  <!--      fullscreen-->
  <!--      :destroy-on-close="true"-->
  <!--      align-center>-->
  <!--    <VideoPlayDialog :dialog-video="video" @dialogVisible="dialogVisibleEmit"/>-->
  <!--  </el-dialog>-->
</template>

<script>
import {getVideoVOById, hotVideoPage, userLikeNums} from "@/api/video";
import {Close, UserFilled} from "@element-plus/icons-vue";
import {followAndFans} from "@/api/social.js";
import {encodeData} from "@/utils/roydon.js";
import {userInfoX} from "@/store/userInfoX";
import {searchHotLoad} from "@/api/search.js";
import VideoPlayDialog from "@/components/video/VideoPlayDialog.vue";
import VideoDiscoverCard from "@/components/video/card/VideoDiscoverCard.vue";
import VideoHotCard from "@/components/video/card/VideoHotCard.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "HotVideo",
  components: {VideoHotCard, VideoDiscoverCard, VideoPlayDialog, Loading},
  computed: {
    Close() {
      return Close
    },
    UserFilled() {
      return UserFilled
    }
  },
  data() {
    return {
      pageDto: {
        pageNum: 1,
        pageSize: 10
      },
      hotSearchPageDto: {
        pageNum: 1,
        pageSize: 50
      },
      userVideoLikes: "",
      followedNums: "",
      fanNums: "",
      dialogVisible: false,
      loading: true,
      loadingIcon: false,
      hotVideoList: [],
      hotVideoTotal: undefined,
      hotVideoQueryParams: {
        pageNum: 1,
        pageSize: 20
      },
      video: {},
      loadingData: true,
      dataNotMore: false,
      activeName: "热榜",//热榜区域
      hotTabShow: [
        {id: 1, tabName: "热榜", tabUrl: "/user/1", dataList: []},
        // {id: 2, tabName: "挑战榜", tabUrl: "/user/4", dataList: []},
      ],
      hotMsg: [],
      playVideoUrl: "",//hover之后播放的video
      userVideoDialogVisible: false,
    };
  },
  created() {
    this.getHotVideoPage()
    // this.getHotSearchPage()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleSocialBehaveNumsHover(userId, index) {
      this.$refs[`pop${index}`][0].showPopper = true
      userLikeNums(userId).then(res => {
        if (res.code === 200) {
          this.userVideoLikes = res.data
        }
      })
      followAndFans(userId).then(res => {
        if (res.code === 200) {
          this.followedNums = res.data.followedNums
          this.fanNums = res.data.fanNums
        }
      })
    },
    handleSocialBehaveNumsHoverLeave(userId, index) {
      this.$refs[`pop${index}`][0].showPopper = false
    },
    getHotVideoPage() {
      this.loading = true
      hotVideoPage(this.hotVideoQueryParams).then(res => {
        if (res.code === 200) {
          this.hotVideoList = res.rows
          this.hotVideoTotal = res.total
          this.loading = false
        }
      })
      searchHotLoad(this.hotSearchPageDto).then(res => {
        if (res.code === 200) {
          this.hotTabShow[0].dataList = res.data
        }
      })
    },
    //获取热搜榜分页查询
    videoDialog(videoId) {
      const videoF = this.hotVideoList.filter(v => {
        return videoId === v.videoId
      })
      this.video = videoF[0]
      this.dialogVisible = true
    },
    dialogDestroy() {
      const videoD = document.getElementsByClassName("dialog-video")
      videoD[0].pause();
    },
    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 200) {
        //加载更多
        if (this.loadingData) {
          // this.loading = true
          this.loadingData = false
          this.loadingIcon = true
          this.hotVideoQueryParams.pageNum += 1
          hotVideoPage(this.hotVideoQueryParams).then(res => {
            if (res.code === 200) {
              if (res.rows.length === 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.hotVideoList = this.hotVideoList.concat(res.rows)
              // this.hotVideoTotal = res.total
              this.loadingIcon = false
              // this.loading = false
              setTimeout(() => {
                // 流控
                this.loadingData = true
              }, 1000);
            } else {
              this.loadingIcon = false
            }
          })
        }
      }
    },
    // 跳转到用户详情页面
    handlePersonInfo(userId) {
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
    // 热榜tab点击
    handleHotTabClick(tab, event) {
      // console.log(tab.props.name);
      // const route = tab.props.name
      // console.log(this.$route.path)
      // console.log(this.$route.matched[1].path)
      // this.$router.push(route)
    },
    // 热门视频卡片hover播放视频
    handleHoverPlayVideo(videoUrl) {
      this.playVideoUrl = videoUrl
      // console.log(this.playVideoUrl)
    },
    // 热搜点击
    handleClickHotTable(it) {
      this.routerJumpVideoSearch(it)
    },
    // 视频搜索路由跳转
    routerJumpVideoSearch(keyword) {
      // 跳转到搜索页面
      this.$router.push(`/search/video?keyword=${keyword}`);
    },
    handleVideoPlayDialog(item) {
      getVideoVOById(item.videoId).then(res => {
        if (res.code === 200) {
          this.video = res.data
          this.userVideoDialogVisible = true
        }
      })
    },
    dialogVisibleEmit(flag) {
      this.userVideoDialogVisible = flag
    }
  }
};
</script>

<style scoped>
@import "@/assets/styles/hotVideo.scss";
</style>

