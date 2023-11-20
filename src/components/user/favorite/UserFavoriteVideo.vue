<template>
  <div class="favorite-video-container">
    <div class="flex-between" v-loading="loadingIcon">
      <el-skeleton class="w100" :loading="loading" animated>
        <template #template>
          <div class="loading-container" v-for="i in 1">
            <div class="loading-item" v-for="i in 5">
              <el-skeleton-item variant="image" style="width: 100%; height: 280px"/>
              <div class="p1rem">
                <el-skeleton-item variant="h1" style="width: 70%"/>
                <div>
                  <el-skeleton-item variant="text"/>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <VideoCard v-for="item in favoriteVideoList" :video="item" @click="handleVideoClick(item)"/>
        </template>
      </el-skeleton>
      <div class="w100">
        <el-empty v-show="favoriteVideoTotal<=0" description="暂无数据"/>
      </div>
    </div>
  </div>
  <div v-if="dataNotMore">
    <el-divider>暂无更多数据</el-divider>
  </div>
  <!--  视频播放弹窗-->
  <el-dialog v-model="dialogVisible"
             @close="dialogDestroy"
             style="height: calc(100% - 10vh);"
             width="80%"
             :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h3 class="one-line" :id="titleId" :class="titleClass">{{ video.videoTitle }}</h3>
      <el-button circle :icon="Close" type="primary" @click="close">
      </el-button>
    </template>
    <video class="dialog-video w100"
           autoplay
           style="max-height: 100%;border-radius: 1rem"
           :src="video.videoUrl"
           controls/>
  </el-dialog>
</template>

<script>
import VideoCard from "@/components/video/VideoCard.vue";
import {videoFavoritePage} from "@/api/behave.js";
import {Close} from "@element-plus/icons-vue";
import {videoMypage} from "@/api/video.js";

export default {
  name: "UserFavoriteVideo",
  computed: {
    Close() {
      return Close
    }
  },
  components: {VideoCard},
  props: {},
  data() {
    return {
      loading: true,
      loadingData: true,
      loadingIcon: false,
      dataNotMore: false,
      dialogVisible: false,
      favoriteVideoList: [],
      favoriteVideoTotal: 0,
      videoQueryParams: {
        videoTitle: "",
        pageNum: 1,
        pageSize: 10
      },
      video: {},
    }
  },
  created() {
    this.initVideoList()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    document.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // 收藏刷视频分页
    initVideoList() {
      this.loading = true
      videoFavoritePage(this.videoQueryParams).then(res => {
        if (res.code === 200) {
          this.favoriteVideoList = res.rows
          this.favoriteVideoTotal = res.total
          this.loading = false
        }
      })
    },
    // 视频点击dialog
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
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10) {
        if(this.dataNotMore){
          return
        }
        //加载更多
        if (this.loadingData) {
          this.loadingIcon = true
          this.loadingData = false
          this.videoQueryParams.pageNum += 1
          videoFavoritePage(this.videoQueryParams).then(res => {
            if (res.code === 200) {
              if (res.rows == null || res.rows.length === 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.favoriteVideoList = this.favoriteVideoList.concat(res.rows)
              this.loadingIcon = false
            } else {
              this.loadingIcon = false
            }
          })
          setTimeout(() => {
            // 流控
            this.loadingData = true
          }, 1000);
        }
      }
    },
  },
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .loading-item {
    width: 20%;
    padding: 0 0.5rem 1rem;
  }
}
</style>
