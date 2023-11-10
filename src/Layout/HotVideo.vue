<template>
  <div class="hot-container">
    <el-scrollbar>
      <el-skeleton style="width: 100%" :loading="loading" animated>
        <template #template>
          <div class="loading-container" v-for="i in 2">
            <div class="loading-item" v-for="i in 4">
              <el-skeleton-item variant="image" style="width: 100%; height: 240px"/>
              <div style="padding: 14px">
                <el-skeleton-item variant="h2" style="width: 70%"/>
                <div>
                  <el-skeleton-item variant="text"/>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <div class="hotVideo-list">
            <div v-loading="loadingIcon"
                 :element-loading-svg="svg"
                 class="custom-loading-svg hotVideos"
                 element-loading-svg-view-box="-10, -10, 50, 50">
              <el-card v-for="item in hotVideoList"
                       :key="item.videoId"
                       class="hotVideo-item">
                <div class="video-cover">
                  <el-image
                      style="height:100%;border-radius: 0.5rem"
                      lazy
                      @click="videoDialog(item.videoId)"
                      :src="item.coverImage"/>
                </div>
                <div class="user-info">
                  <div class="one-line fs8 cb">{{ item.videoTitle }}
                    <p class="one-line fs7 cg">{{ item.videoDesc }}</p>
                  </div>
                  <!--鼠标悬停在视频发布者头像上时展示该视频发布者的信息-->
                  <el-popover
                      :width="300"
                      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                      :show-after=handleSocialBahaveNums(item.userId)
                  >
                    <!--视频发布者的头像-->
                    <template #reference>
                      <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>
                      <el-avatar v-else :icon="UserFilled"/>
                    </template>
                    <template #default>
                      <!--视频发布者的头像、名称和关注粉丝等信息展示模块-->
                      <div
                          class="demo-rich-conent"
                          style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <!--视频发布者的头像div-->
                        <div style="display: flex;">
                          <div>
                            <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>
                            <el-avatar v-else :icon="UserFilled"/>
                          </div>
                          <!--名称和关注粉丝等信息展示模块-->
                          <div style="display: grid;  margin-left: 20px;">
                            <!--名称展示模块-->
                            <div>
                              <p>{{ item.userNickName }}</p>
                            </div>
                            <!--点赞、关注、粉丝等信息展示模块-->
                            <div style="display: flex;">
                              <!--关注信息展示模块-->
                              <div style="display: flex">
                                <p
                                    class="demo-rich-content__name"
                                    style="margin: 0; font-weight: 500"
                                >{{ userVideoLikes }}</p>
                                <p class="demo-rich-content__mention"
                                   style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                                  关注
                                </p>
                              </div>
                              <!--粉丝信息展示模块-->
                              <div style="display: flex">
                                <p
                                    class="demo-rich-content__mention"
                                    style="margin-left: 10px; font-weight: 500"
                                >
                                  {{ followedNums }}</p>
                                <p class="demo-rich-content__mention"
                                   style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                                  粉丝
                                </p>
                              </div>
                              <!--获赞信息展示模块-->
                              <div style="display: flex">
                                <p class="demo-rich-content__desc" style="margin-left: 10px;">
                                  {{ fanNums }}
                                </p>
                                <p class="demo-rich-content__mention"
                                   style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                                  获赞
                                </p>
                              </div>
                            </div>
                            <!--关注以及私信功能模块展示-->
                            <div style="display: flex; margin-top: 10px;">
                              <div v-if="item.weatherFollow">
                                <el-button
                                    :type="'primary'"
                                    text
                                    bg
                                    style="color: #8c8c8c;background-color: #e3e5e7;"
                                >
                                  已关注
                                </el-button>
                              </div>
                              <div v-else>
                                <el-button
                                    :type="'primary'"
                                    text
                                    bg
                                    style="color: #fbfdfd;background-color: #4d97e1;">+关注
                                </el-button>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    </template>
                  </el-popover>
                  <!--                  <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>-->
                  <!--                  <el-avatar v-else :icon="UserFilled"/>-->
                </div>
              </el-card>
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
          <h3 class="one-line" :id="titleId" :class="titleClass" style="color: black">{{ video.videoTitle }}</h3>
          <el-button circle :icon="Close" type="info" @click="close">
          </el-button>
        </template>
        <video class="dialog-video"
               style="width: 100%;max-height: 100%;border-radius: 1rem"
               autoplay
               :src="video.videoUrl"
               controls/>
      </el-dialog>
      <el-empty v-show="hotVideoTotal<=0" description="暂无数据"/>
    </el-scrollbar>
  </div>
</template>

<script>
import {hotVideoPage, userLikeNums} from "@/api/video";
import {Close, UserFilled} from "@element-plus/icons-vue";
import {followAndFans} from "@/api/social.js";

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
      userVideoLikes: "",
      followedNums: "",
      fanNums: "",
      dialogVisible: false,
      loading: true,
      loadingIcon: false,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
      hotVideoList: [],
      hotVideoTotal: undefined,
      hotVideoQueryParams: {
        pageNum: 1,
        pageSize: 12
      },
      video: {},
      loadingData: true,
      dataNotMore: false
    };
  },
  created() {
    this.getHotVideoPage()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {

    handleSocialBahaveNums(userId) {
      userLikeNums(userId).then(res => {
        if (res.code === 200) {
          this.userVideoLikes = res.data
          // console.log(this.userVideoLikes)
          console.log(res.data)
        }
      })
      followAndFans(userId).then(res => {
        if (res.code === 200) {
          this.followedNums = res.data.followedNums
          this.fanNums = res.data.fanNums
          console.log(res.data)
        }
      })
    },
    getHotVideoPage() {
      this.loading = true
      hotVideoPage(this.hotVideoQueryParams).then(res => {
        if (res.code === 200) {
          this.hotVideoList = res.rows
          this.hotVideoTotal = res.total
          this.loading = false
          console.log(this.hotVideoList)
        }
      })
    },
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
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 1) {
        //加载更多
        if (this.loadingData) {
          this.loading = true
          this.loadingData = false
          this.hotVideoQueryParams.pageNum += 1
          hotVideoPage(this.hotVideoQueryParams).then(res => {
            if (res.code === 200) {
              if (res.rows.length == 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.hotVideoList = this.hotVideoList.concat(res.rows)
              // this.hotVideoTotal = res.total
              this.loadingIcon = false
              setTimeout(() => {
                // 流控
                this.loadingData = true
              }, 2000);
            } else {
              this.loadingIcon = false
            }
          })
        }
      }
    },
  }
};
</script>

<style scoped>
@import "@/assets/styles/hotVideo.scss";
</style>

