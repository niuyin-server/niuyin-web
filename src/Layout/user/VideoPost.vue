<template>
  <div class="flex-between">
    <VideoCard v-for="item in postVideoList" :video="item" @click="handleVideoClick(item)"/>
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
      dialogVisible: false,
      postVideoList: [],
      postVideoTotal: 0,
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
      videoMypage(this.videoQueryParams).then(res => {
        if (res.code === 200) {
          this.postVideoList = res.rows
          this.postVideoTotal = res.total
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
