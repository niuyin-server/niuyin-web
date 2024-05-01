<template>
  <div class="video-card">
    <div class="video-cover-image" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
      <div v-if="!playVideo" class="cover-image">
        <el-image class="cover-image eli-ofc cp" :src="video.coverImage"/>
        <div class="video-like flex-center">
          <svg class="icon1rem" aria-hidden="true">
            <use xlink:href="#icon-like-num"></use>
          </svg>
          <span class="ml-5r">{{ video.likeNum }}</span>
        </div>
        <div class="video-duration flex-center">
          <span class="fs8 cw">{{ formatDuration(video.videoInfo) }}</span>
        </div>
        <div v-if="video.publishType==='1'" class="flex-center video-type-pics">
          <svg class="icon1rem ml5" aria-hidden="true">
            <use xlink:href="#icon-pics"></use>
          </svg>
          <span class="type-desc fs7 fw500">图文</span>
        </div>
      </div>
      <div v-if="playVideo" class="wh100 background-custom" :style="{ backgroundImage: `url(${video.coverImage})` }">
        <!--            图文轮播-->
        <ImagePlayer v-if="video.publishType==='1'" :image-list="video.imageList"/>
        <!--            视频-->
        <VideoPlayer v-if="video.publishType==='0'"
                     class="videoPlayer wh100"
                     id="videoPlayer"
                     :video="video"/>
      </div>
    </div>
    <div class="video-info">
      <p v-html="video.videoTitle" class="video-title two-line fs8"></p>
      <div class="video-author one-line flex-between">
        <span v-if="video.userNickName" class="fs7">@{{ video.userNickName }}</span>
        <span class="cg fs7">发布于 · {{ smartDateFormat(video.createTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import ImagePlayer from "@/components/video/ImagePlayer.vue";

export default {
  name: "VideoCard",
  components: {ImagePlayer, VideoPlayer},
  props: {
    video: Object,
  },
  data() {
    return {
      playVideo: false,
    }
  },
  created() {
  },
  methods: {
    handleMouseover() {
      this.playVideo = true
    },
    handleMouseleave() {
      this.playVideo = false
    },
    formatDuration(videoInfo) {
      if (videoInfo == null || videoInfo == "" || videoInfo == undefined) {
        return
      }
      const info = JSON.parse(videoInfo);
      const durationInSeconds = info.duration;
      let formattedDuration = '';

      if (durationInSeconds >= 3600 * 1000) {
        formattedDuration = new Date(durationInSeconds).toISOString().substr(11, 8);
      } else {
        formattedDuration = new Date(durationInSeconds).toISOString().substr(14, 5);
      }

      return formattedDuration;
    }
  },
}
</script>

<style scoped>
@import "@/assets/styles/components/video-card.scss";

:deep(.d-player-wrap .d-player-control) {
  height: 10px !important;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  display: none !important;
}

</style>
