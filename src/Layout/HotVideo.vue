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
                  <el-popover
                      :width="300"
                      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
                  >
                    <template #reference>
                      <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>
                      <el-avatar v-else :icon="UserFilled"/>
                    </template>
                    <template #default>
                      <div
                          class="demo-rich-conent"
                          style="display: flex; gap: 16px; flex-direction: column"
                      >
                        <!--                        <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>-->
                        <!--                        <el-avatar v-else :icon="UserFilled"/>-->
                        <div>
                          <p
                              class="demo-rich-content__name"
                              style="margin: 0; font-weight: 500"
                          >
                            Element Plus
                          </p>
                          <p
                              class="demo-rich-content__mention"
                              style="margin: 0; font-size: 14px; color: var(--el-color-info)"
                          >
                            @element-plus
                          </p>
                        </div>

                        <p class="demo-rich-content__desc" style="margin: 0">
                          Element Plus, a Vue 3 based component library for developers,
                          designers and product managers
                        </p>
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
import {hotVideoPage} from "@/api/video";
import {Close, UserFilled} from "@element-plus/icons-vue";

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
          // this.loading = true
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
              // this.loading = false
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

