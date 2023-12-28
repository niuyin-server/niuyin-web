<template>
  <div class="video-card flex-row">
    <div class="video-cover-image wh100" :style="{ backgroundImage: `url(${video.coverImage})` }"
         @mouseover="handleMouseover" @mouseleave="handleMouseleave">
      <!--      <el-image class="cover-image pa eli-ofc cp wh100" :src="video.coverImage"/>-->
      <div v-if="!playVideo" class="cover-image">
        <el-image class="cover-image eli-ofc cp" :src="video.coverImage"/>
        <div class="video-like">
          <svg class="icon1rem" aria-hidden="true">
            <use xlink:href="#icon-like-num"></use>
          </svg>
          <span class="ml-5r">{{ video.likeNum }}</span>
        </div>
        <div v-if="video.publishType==='1'" class="flex-center video-type-pics">
          <svg class="icon1rem ml5" aria-hidden="true">
            <use xlink:href="#icon-pics"></use>
          </svg>
          <span class="type-desc fs7 fw500">图文</span>
        </div>
      </div>
      <div v-if="playVideo" class="background-custom">
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
  name: "VideoShowCard",
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
    }
  },
}
</script>

<style scoped>
.video-card {
  background-color: var(--el-bg-color-page);
  border-radius: 1rem;
  display: flex;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .12);
  }

  .video-cover-image {
    width: auto;
    object-fit: contain;
    overflow: hidden;
    border-radius: 1rem 1rem 0 0;
    position: relative;
    background-size: contain;

    .cover-image {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 1rem 1rem 0 0;
    }

    .cover-image:hover {
      transition: all .5s ease;
      transform: scale(1.1);
    }

    .video-like {
      position: absolute;
      bottom: 3%;
      color: white;
      left: 5%;
    }
  }

  .video-info {
    width: auto;
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

.video-type-pics {
  position: absolute;
  left: 5%;
  top: 4%;
  padding: 5px 10px;
  background: var(--niuyin-bg-color2);
  backdrop-filter: blur(10px);
  border-radius: 6px;

  .type-desc {
    margin-left: 2px;
    color: gold;
  }
}

/*移动端适配*/
@media (max-width: 500px) {
  .video-card {
    width: 49%;
    height: 160px;
  }
}

:deep(.d-player-wrap .d-player-control) {
  height: 10px !important;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  display: none !important;
}

</style>
