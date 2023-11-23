<template>
  <div class="favorite-music-container">
    <!--    <div v-loading="loading"-->
    <!--         :element-loading-svg="svg"-->
    <!--         element-loading-svg-view-box="-10, -10, 50, 50">-->
    <!--      <VideoPlayerSwiper v-if="showVideoPlayer" :loading="loading" :video-list="videoList"/>-->
    <!--      <div class="flex-between">-->
    <!--        <div class="w100">-->
    <!--          <el-empty description="暂无数据"/>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="flex-between">
      <div class="w100">
        <el-empty description="暂无数据"/>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayerSwiper from "@/components/video/VideoPlayerSwiper.vue";
import {videoFeed} from "@/api/video.js";

export default {
  name: "UserFavoriteMusic",
  components: {VideoPlayerSwiper},
  props: {},
  data() {
    return {
      loading: true,
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>`,
      videoList: [],
      showVideoPlayer: false,
    }
  },
  created() {
    // this.getVideoFeed()
  },
  methods: {
    // getVideoFeed() {
    //   this.loading = true
    //   videoFeed(this.publishTime).then(res => {
    //     if (res.code === 200 && res.data != null) {
    //       this.videoList = res.data
    //       // this.videoList = [...this.videoList, ...res.data];
    //       this.loading = false
    //       this.publishTime = res.data[this.videoList.length - 1].createTime
    //       this.showVideoPlayer = true
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   })
    // },
  },

}
</script>

<style scoped>

</style>
