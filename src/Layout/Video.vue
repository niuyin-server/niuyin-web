<template>
  <!--  视频播放-->
  <VideoPlayerCarousel
      v-if="showVideoPlayer"
      :loading="loading"
      :video-list="videoList"
      @reloadVideoFeed="reloadVideoFeedEmit"/>
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
      // this.showVideoPlayer = val;
      this.$nextTick(() => {
        // this.showVideoPlayer = true;
        // this.getVideoFeed();
        videoFeed(this.publishTime).then(res => {
          if (res.code === 200 && res.data != null) {
            // this.videoList = res.data
            Object.assign(this.videoList, res.data)
            // this.videoList = [...this.videoList, ...res.data];
            this.loading = false
            this.publishTime = this.videoList[this.videoList.length - 1].createTime
          } else {
            this.$message.error(res.msg)
          }
        })
      });
    }
  }
}

</script>

<style lang='less' scoped>
.niuyin-video-player {
  margin-bottom: 1rem;
}
</style>
