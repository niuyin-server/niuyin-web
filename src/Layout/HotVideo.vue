<template>
  <div class="hot-container">
    <el-scrollbar>
      <div v-loading="loading"
           :element-loading-svg="svg"
           class="custom-loading-svg"
           element-loading-svg-view-box="-10, -10, 50, 50"
           style="display: flex;flex-flow: row wrap;justify-content: space-between">
        <el-card v-for="item in hotVideoList"
                 :key="item.videoId"
                 style="padding:1rem;background-color: white;width: 32.66%;border-radius:0.5rem;height: 300px;margin-bottom: 0.5rem">
          <div style="height: 80%;border-radius: 0.5rem;text-align: center">
            <el-image
                style="height:100%;border-radius: 0.5rem"
                @click="videoDialog(item.videoId)"
                :src="item.coverImage"/>
          </div>
          <div style="height:20%;margin-top:10px;display: flex;justify-content: space-between;align-items: center">
            <div class="one-line" style="font-size: 0.8rem;color: black">{{ item.videoTitle }}
              <p class="one-line" style="font-size: 0.7rem;color: gray;">{{ item.videoDesc }}</p>
            </div>
            <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>
            <el-avatar v-else :icon="UserFilled"/>
          </div>
        </el-card>
      </div>
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
        pageSize: 10
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
          // console.log(this.hotVideoList)
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
                this.loading = false
                this.loadingData = false
                return;
              }
              this.hotVideoList = this.hotVideoList.concat(res.rows)
              // this.hotVideoTotal = res.total
              this.loading = false
              setTimeout(() => {
                // 流控
                this.loadingData = true
              }, 2000);
            }
          })
        }
      }
    },
  }
};
</script>

<style scoped lang="less">
.hot-container {
  border-radius: 1rem;
  height: 100%;
  padding: 0 1rem 1rem 0;
}

</style>

