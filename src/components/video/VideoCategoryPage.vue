<template>
  <div class="video-page-container">
    <div v-loading="loading"
         :element-loading-svg="svg"
         class="custom-loading-svg"
         element-loading-svg-view-box="-10, -10, 50, 50"
         style="display: flex;flex-flow: row wrap;justify-content: space-between">
      <el-card v-for="item in videoList"
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
      <el-empty v-show="videoTotal<=0" description="暂无数据"/>
    </div>
    <el-pagination v-show="videoTotal>0"
                   :total="videoTotal"
                   background
                   layout="prev, pager, next"
                   v-model:current-page="videoQueryParams.pageNum"
                   :page-size="videoQueryParams.pageSize"
                   @current-change="handleCurrentChange"
                   @pagination="getVideoList"/>
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
</template>

<script>
import {videoCategoryPage} from "@/api/video.js";
import {Close, UserFilled} from "@element-plus/icons-vue";

export default {
  name: 'VideoCategoryPage',
  computed: {
    UserFilled() {
      return UserFilled
    },
    Close() {
      return Close
    }
  },
  props: {
    channelId: Number,
  },
  data() {
    return {
      videoQueryParams: {
        categoryId: undefined,
        pageNum: 1,
        pageSize: 6,
      },
      videoList: [],
      videoTotal: undefined,
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
      dialogVisible: false,
      video: {},
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    getVideoList() {
      this.loading = true
      this.videoQueryParams.categoryId = this.channelId
      videoCategoryPage(this.videoQueryParams).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.videoList = res.rows
          this.videoTotal = res.total
        }
      })
    },
    handleCurrentChange() {
      this.getVideoList()
    },
    videoDialog(videoId) {
      const videoF = this.videoList.filter(v => {
        return videoId === v.videoId
      })
      this.video = videoF[0]
      this.dialogVisible = true
    },
    dialogDestroy() {
      const videoD = document.getElementsByClassName("dialog-video")
      videoD[0].pause();
    }
  },
}
</script>

<style scoped>
.video-page-container {
  border-radius: 1rem;
  height: 100%;
  backdrop-filter: blur(20px);
}
</style>
