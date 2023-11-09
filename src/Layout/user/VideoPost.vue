<template>
  <div class="flex-between" v-loading="loadingIcon">
    <el-skeleton class="w100" :loading="loading" animated>
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
        <VideoCard
            v-for="item in postVideoList"
            :video="item"
            @click="handleVideoClick(item)"/>
      </template>
    </el-skeleton>
    <!--  视频播放弹框  -->
    <el-dialog v-model="dialogVisible"
               @close="dialogDestroy"
               style="height: calc(100% - 10vh);"
               width="80%"
               :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h3 class="one-line" :id="titleId" :class="titleClass" style="color: black">{{ video.videoTitle }}</h3>
        <el-button circle :icon="Close" class="cb" type="info" @click="close">
        </el-button>
      </template>
      <video class="dialog-video w100"
             autoplay
             style="max-height: 100%;border-radius: 1rem"
             :src="video.videoUrl"
             controls/>
    </el-dialog>
    <div class="w100">
      <el-empty v-show="postVideoTotal<=0" description="暂无数据"/>
    </div>
  </div>
  <div v-if="dataNotMore">
    <el-divider>暂无更多数据</el-divider>
  </div>
</template>

<script>
import {videoMypage} from "@/api/video.js";
import VideoCard from "@/components/video/VideoCard.vue";
import {Close} from "@element-plus/icons-vue";

export default {
  name: "VideoPost",
  computed: {
    Close() {
      return Close
    }
  },
  components: {VideoCard},
  data() {
    return {
      loading: true,
      dialogVisible: false,
      postVideoList: [],
      postVideoTotal: 0,
      videoQueryParams: {
        videoTitle: "",
        pageNum: 1,
        pageSize: 12
      },
      video: {},
      loadingData: true,
      loadingIcon: false,
      dataNotMore: false
    }
  },
  created() {
    this.initVideoList()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    initVideoList() {
      this.loading = true
      videoMypage(this.videoQueryParams).then(res => {
        if (res.code === 200) {
          this.postVideoList = res.rows
          this.postVideoTotal = res.total
          this.loading = false
        }
      })
    },
    handleVideoClick(video) {
      this.video = video
      this.dialogVisible = true
    },
    dialogDestroy() {
      const videoD = document.getElementsByClassName("dialog-video")
      videoD[0].pause();
      this.dialogVisible = false
    },
    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 1) {
        //加载更多
        if (this.loadingData) {
          this.loadingIcon = true
          this.loadingData = false
          this.videoQueryParams.pageNum += 1
          videoMypage(this.videoQueryParams).then(res => {
            if (res.code === 200) {
              if (res.rows.length == 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.postVideoList = this.postVideoList.concat(res.rows)
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
}

</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .loading-item {
    width: 24.5%;
  }
}
</style>
