<template>
  <div class="flex-between">
    <VideoCard v-for="item in likeVideoList" :video="item" @click="handleVideoClick(item)"/>
<!--    <VideoWaterfall :video-list="likeVideoList"></VideoWaterfall>-->
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
      <el-empty v-show="likeVideoTotal<=0" description="暂无数据"/>
    </div>
  </div>
</template>

<script>
import {videoLikePage} from "@/api/behave.js"
import {Close} from "@element-plus/icons-vue";
import VideoCard from "@/components/video/VideoCard.vue";
import VideoWaterfall from "@/components/video/VideoWaterfall.vue";

export default {
  name: "VideoLike",
  components: {VideoWaterfall, VideoCard},
  computed: {
    Close() {
      return Close
    }
  },
  data() {
    return {
      dialogVisible: false,
      likeVideoList: [],
      likeVideoTotal: 0,
      videoQueryParams: {
        videoTitle: "",
        pageNum: 1,
        pageSize: 12
      },
      video: {},
    }
  },
  created() {
    this.initVideoList()
  },
  methods: {
    initVideoList() {
      videoLikePage(this.videoQueryParams).then(res => {
        if (res.code === 200) {
          this.likeVideoList = res.rows
          this.likeVideoTotal = res.total
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
    }
  }
}

</script>

<style scoped>

</style>
