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
            <div v-loading="loadingIcon"
                 :element-loading-svg="svg"
                 class="hotVideos"
                 element-loading-svg-view-box="-10, -10, 50, 50"
                 v-masonry
                 fit-width="true"
                 transition-duration="0.3s"
                 item-selector=".hotVideo-item">
              <!--              热榜-->
              <div style="height: 600px;" class="hotVideo-item">
                <el-card class="hotVideo-card wh100">
                  <el-tabs v-model="activeName" @tab-click="handleHotTabClick">
                    <el-tab-pane v-for="item in hotTabShow"
                                 :key="item.id"
                                 :label="item.tabName"
                                 :lazy="true"
                                 :name="item.tabName">
                      <!--                    <router-view/>-->
                      <div v-for="(it,index) in item.dataList" class="p5px">
                        <p class="text-hv-primary cp one-line hot-hover-item">
                          <span class="mr5px">{{ index + 1 }}、</span>
                          <span class="lh-1-5" @click="handleClickHotTable(it)"> {{ it }}</span>
                        </p>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </el-card>
              </div>
              <!--              热门视频-->
              <div v-for='(item,index) in hotVideoList'
                   :key="item.videoId"
                   v-masonry-tile
                   class="hotVideo-item">
                <el-card class="hotVideo-card">
                  <div class="video-cover tac">
                    <el-image class="eli-ofc wh100"
                              @click="videoDialog(item.videoId)"
                              :src="item.coverImage"/>
                  </div>
                  <div class="user-info">
                    <div>
                      <p class="one-line fs9">{{ item.videoTitle }}</p>
                      <p class="one-line fs7 cg">{{ item.videoDesc }}</p>
                    </div>
                    <!--鼠标悬停在视频发布者头像上时展示该视频发布者的信息-->
                    <el-popover :width="300"
                                placement="top"
                                popper-class="person-info-pop"
                                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                                :ref="'pop'+index">
                      <!--视频发布者的头像-->
                      <template #reference>
                        <div>
                          <el-avatar v-if="item.userAvatar"
                                     class="cp"
                                     :lazy="true"
                                     :src="item.userAvatar"
                                     @click="handlePersonInfo(item.userId)"
                                     @mouseover="handleSocialBehaveNumsHover(item.userId,index)"
                                     @mouseleave="handleSocialBehaveNumsHoverLeave(item.userId,index)"/>
                          <el-avatar v-else class="cp"
                                     :icon="UserFilled"
                                     @click="handlePersonInfo(item.userId)"/>
                        </div>
                      </template>
                      <template #default>
                        <!--视频发布者的头像、名称和关注粉丝等信息展示模块-->
                        <div class="flex-column">
                          <!--视频发布者的头像div-->
                          <div style="display: flex;">
                            <div>
                              <el-avatar v-if="item.userAvatar" class="cp" :src="item.userAvatar"/>
                              <el-avatar v-else class="cp" :icon="UserFilled"/>
                            </div>
                            <!--名称和关注粉丝等信息展示模块-->
                            <div style="display: grid; margin-left: 10px;">
                              <!--名称展示模块-->
                              <div v-html="item.userNickName" class="fs9 fw600 cp"></div>
                              <!--点赞、关注、粉丝等信息展示模块-->
                              <div class="flex-between">
                                <!--关注信息展示模块-->
                                <p class="">{{ userVideoLikes }}</p><span>关注</span>
                                <!--粉丝信息展示模块-->
                                <p class="ml-5r">{{ followedNums }}<span>粉丝</span></p>
                                <!--获赞信息展示模块-->
                                <p class="ml-5r">{{ fanNums }}</p><span>获赞</span>
                              </div>
                              <!--关注以及私信功能模块展示-->
                              <div style="display: flex; margin-top: 10px;">
                                <div v-if="item.weatherFollow">
                                  <el-button type="info">已关注</el-button>
                                </div>
                                <div v-else>
                                  <el-button type="primary">+关注</el-button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
      <div v-if="dataNotMore">
        <el-divider>暂无更多数据</el-divider>
      </div>
      <el-dialog v-model="dialogVisible"
                 @close="dialogDestroy"
                 style="height: calc(100% - 10vh);"
                 width="80%"
                 :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <h3 class="one-line" :id="titleId" :class="titleClass">{{ video.videoTitle }}</h3>
          <el-button circle :icon="Close" type="info" @click="close">
          </el-button>
        </template>
        <video class="dialog-video"
               style="width: 100%;max-height: 100%;border-radius: 1rem"
               autoplay
               :src="video.videoUrl"
               controls/>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>

<script>
import {hotVideoPage, userLikeNums} from "@/api/video";
import {Close, UserFilled} from "@element-plus/icons-vue";
import {followAndFans} from "@/api/social.js";
import {encodeData} from "@/utils/roydon.js";
import {userInfoX} from "@/store/userInfoX";
import {searchHotLoad} from "@/api/search.js";

export default {
  name: "HotVideo",
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
      userVideoLikes: "",
      followedNums: "",
      fanNums: "",
      dialogVisible: false,
      loading: true,
      loadingIcon: false,
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>`,
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
        {id: 2, tabName: "娱乐榜", tabUrl: "/user/2", dataList: []},
        {id: 3, tabName: "社会榜", tabUrl: "/user/3", dataList: []},
        {id: 4, tabName: "挑战榜", tabUrl: "/user/4", dataList: []},
      ],
      hotMsg: [],
      playVideoUrl: "",//hover之后播放的video
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
      searchHotLoad(this.pageDto).then(res => {
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
    handleClickHotTable(it){
      this.routerJumpVideoSearch(it)
    },
    // 视频搜索路由跳转
    routerJumpVideoSearch(keyword) {
      // 跳转到搜索页面
      this.$router.push(`/videoSearch?keyword=${keyword}`);
    },
  }
};
</script>

<style scoped>
@import "@/assets/styles/hotVideo.scss";
</style>

