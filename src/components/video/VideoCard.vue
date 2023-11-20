<template>
  <div class="video-card">
    <div class="video-cover-image" @mouseover="handleMouseover" @mouseleave="handleMouseleave">
      <div v-if="!playVideo" class="cover-image">
        <el-image class="cover-image eli-ofc cp" :src="video.coverImage"/>
        <div class="video-like">
          <i class="iconfont icon-like-num "></i>
          <span class="ml-5r">{{ video.likeNum }}</span>
        </div>
      </div>
      <div v-if="playVideo" class="wh100 background-custom" :style="{ backgroundImage: `url(${video.coverImage})` }">
        <VideoPlayer class="videoPlayer wh100"
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

export default {
  name: "VideoCard",
  components: {VideoPlayer},
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
    }
  },
}
</script>

<style scoped>
.video-card {
  background-color: var(--el-bg-color-page);
  border-radius: 1rem;
  width: 19%;
  box-shadow: rgba(0, 0, 0, 0.13) 0 2px 3px 0, rgba(0, 0, 0, 0.11) 0 1px 1px 0;
  transition: all 0.3s ease;
  height: 360px;
  margin-bottom: 1.2rem;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .12);
  }

  .video-cover-image {
    width: auto;
    object-fit: contain;
    height: 80%;
    overflow: hidden;
    border-radius: 1rem 1rem 0 0;
    position: relative;

    .cover-image {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 1rem 1rem 0 0;
    }

    .cover-image:hover {
      transition: all 1s ease;
      transform: scale(1.1);
    }

    .video-like {
      position: absolute;
      bottom: 5%;
      color: white;
      left: 5%;

    }
  }

  .video-info {
    width: auto;
    height: 20%;
    padding: 10px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;

    .video-title {

    }

    .video-author {

    }
  }

}

/*移动端适配*/
@media (max-width: 500px) {
  .video-card {
    width: 49%;
    height: 160px;
  }
}

</style>
