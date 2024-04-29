<template>
  <!--  视频播放-->
  <VideoPlayerCarousel
      v-if="showVideoPlayer"
      :loading="loading"
      :video-list="videoList"
      @reloadVideoFeed="reloadVideoFeedEmit"/>
  <!--  <div v-loading="loading"-->
  <!--       class="wh100"-->
  <!--       :element-loading-svg="svg"-->
  <!--       element-loading-svg-view-box="-10, -10, 50, 50">-->
  <!--    <VideoPlayerSwiper v-if="showVideoPlayer"-->
  <!--                       :loading="loading"-->
  <!--                       :video-list="videoList"-->
  <!--                       @reloadVideoFeed="reloadVideoFeedEmit"/>-->
  <!--  </div>-->
</template>

<script>
import VideoPlayerCarousel from "@/components/video/VideoPlayerCarousel.vue";
import {videoFeed} from "@/api/video"
import VideoPlayerSwiper from "@/components/video/VideoPlayerSwiper.vue";

export default {
  name: 'Video',
  components: {VideoPlayerSwiper, VideoPlayerCarousel},
  data() {
    return {
      loading: true,
      autoPlay: true, // 自动播放视频
      showVideoPlayer: true,
      publishTime: null,
      videoUrl: null,
      videoList: [],
      // add
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>`,
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
          this.videoList = this.videoList.concat(res.data)
          // this.videoList = [...this.videoList, ...res.data];
          this.loading = false
          this.publishTime = this.videoList[this.videoList.length - 1].createTime
          this.showVideoPlayer = true
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    autoPlayVideo(val) {
      this.autoPlay = val;
    },
    reloadVideoFeedEmit(val) {
      // this.showVideoPlayer = val;
      // this.showVideoPlayer = false
      this.loading = val
      // this.$nextTick(() => {
      // this.showVideoPlayer = true;
      // this.getVideoFeed();
      videoFeed(this.publishTime).then(res => {
        if (res.code === 200 && res.data != null) {
          this.videoList = res.data
          // Object.assign(this.videoList, res.data)
          // this.videoList = [...this.videoList, ...res.data];
          this.loading = false
          this.publishTime = this.videoList[this.videoList.length - 1].createTime
          this.showVideoPlayer = true
        } else {
          this.$message.error(res.msg)
        }
      })
      // });
    }
  }
}

</script>

<style lang='less' scoped>
.niuyin-video-player {
  margin-bottom: 1rem;
}
</style>
