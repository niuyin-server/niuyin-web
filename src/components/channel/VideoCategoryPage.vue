<template>
  <div class="video-page-container"
       v-loading="loading">
    <div class="flex-between">
      <el-card v-for="item in videoList"
               :key="item.videoId"
               class="video-card-transition video-card">
        <div class="w100" style="height: 80%;border-radius: 1rem 1rem 0 0;text-align: center;overflow: hidden">
          <el-image
              class="wh100 eli-ofc cp"
              @click="videoDialog(item.videoId)"
              :src="item.coverImage"/>
        </div>
        <div style="height:20%;padding:10px;display: flex;justify-content: space-between;align-items: center">
          <div class="w100">
            <p class="one-line cb fs9">{{ item.videoTitle }}</p>
            <marquee class="one-line cg fs7">{{ item.videoDesc }}</marquee>
          </div>
          <div class="cp">
            <!--            <el-avatar v-if="item.userAvatar" :src="item.userAvatar"/>-->
            <!--            <el-avatar v-else :icon="UserFilled"/>-->
          </div>
        </div>
      </el-card>
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
  <div class="w100">
    <el-empty v-show="videoTotal<=0" description="暂无数据"/>
  </div>
  <el-dialog v-model="dialogVisible"
             @close="dialogDestroy"
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
        pageSize: 15,
      },
      videoList: [],
      videoTotal: undefined,
      loading: true,
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
}

.video-card {
  width: 19%;
  border-radius: 1rem;
  height: 200px;
  background-color: rgba(242, 242, 243, 0.8);
  margin-bottom: 1rem;
  box-shadow: rgba(0, 0, 0, 0.13) 0 2px 3px 0, rgba(0, 0, 0, 0.11) 0 1px 1px 0;
}

.dialog-video {
  height: 60vh;
}

@media (max-width: 500px) {
  .video-card {
    width: 49%;
    border-radius: 0.5rem;
    height: 120px;
  }
}
</style>
