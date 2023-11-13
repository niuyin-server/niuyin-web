<template>
  <!--  视频播放-->
  <!--  <VideoPlayer-->
  <!--      v-if="showVideoPlayer"-->
  <!--      :autoPlay="autoPlay"-->
  <!--      :video-url="videoUrl"-->
  <!--      @reloadVideoFeed="reloadVideoFeedEmit"-->
  <!--  ></VideoPlayer>-->
  <!--  <VideoPlayerSwiper-->
  <!--      v-if="showVideoPlayer"-->
  <!--      :video-list="videoList"-->
  <!--      @reloadVideoFeed="reloadVideoFeedEmit"-->
  <!--  ></VideoPlayerSwiper> -->
  <!--  <el-space style="width: 100%;height: 100%" direction="vertical" alignment="flex-start">-->
  <!--    <el-skeleton style="width: 100%" :loading="loading" animated>-->
  <!--      <template #template>-->
  <!--        <el-skeleton-item variant="image" style="width: 240px; height: 240px"/>-->
  <!--      </template>-->
  <!--      <template #default>-->
  <div class="wh100 pr flex-between custom-loading-svg"
       v-loading="loading"
       :element-loading-svg="svg"
       element-loading-svg-view-box="-10, -10, 50, 50">
    <VideoPlayerCarousel
        v-if="showVideoPlayer"
        :video-list="videoList"
        @reloadVideoFeed="reloadVideoFeedEmit"
    ></VideoPlayerCarousel>
  </div>
  <!--      </template>-->
  <!--    </el-skeleton>-->
  <!--  </el-space>-->
  <!--  <VideoPlayerScroll-->
  <!--      v-if="showVideoPlayer"-->
  <!--      :video-list="videoList"-->
  <!--  ></VideoPlayerScroll>-->
</template>

<script>
import VideoPlayerCarousel from "@/components/video/VideoPlayerCarousel.vue";
import {videoFeed} from "@/api/video"

export default {
  name: 'Video',
  components: {VideoPlayerCarousel},
  data() {
    return {
      loading: true,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>
      `,
      autoPlay: true, // 自动播放视频
      showVideoPlayer: true,
      publishTime: null,
      videoUrl: null,
      videoList: [],
    }
  },
  created() {
    this.getVideoFeed()
  },
  mounted() {
  },
  methods: {
    getVideoFeed() {
      this.loading = true
      videoFeed(this.publishTime).then(res => {
        if (res.code === 200 && res.data != null) {
          this.videoList = res.data
          // this.videoList = [...this.videoList, ...res.data];
          this.loading = false
          this.publishTime = res.data[this.videoList.length - 1].createTime
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    autoPlayVideo(val) {
      this.autoPlay = val;
    },
    reloadVideoFeedEmit(val) {
      this.showVideoPlayer = val;
      this.$nextTick(() => {
        this.showVideoPlayer = true;
        this.getVideoFeed();
      });
    }
  }
}

</script>

<style lang='less' scoped>

</style>
